import express from "express";
import cors from "cors";
import multer from "multer";
import { QdrantVectorStore } from "@langchain/qdrant";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";
import { configDotenv } from "dotenv";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import fs from "fs";
import { PDFDocument } from "pdf-lib";

configDotenv();
const apiKey = process.env.GEN_AI_API;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Math.round(Math.random() * 1e4);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });
const app = express();
app.use(cors());
app.get("/", (req, res) => {
  return res.status(200).json({ status: "Everything is running  ✅" });
});

app.post("/upload/pdf", upload.single("pdf"), async (req, res) => {
  let { collectionName } = req.body;
  const buffer = fs.readFileSync(req.file.path);
  let pages = 999;
  try {
    const pdfDoc = await PDFDocument.load(buffer);
    pages = pdfDoc.getPageCount();
  } catch (err) {
    return res.status(500).json({ message: " Failed to parse PDF" });
  }
  if (pages > 60) {
    return res.status(413).json({ message: "No of pages should be atmost 60" });
  }

  const loader = new PDFLoader(req.file.path);
  const docs = await loader.load();
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 700,
    chunkOverlap: 70,
  });
  const splitDocs = await splitter.splitDocuments(
    docs.map((doc) => {
      doc.metadata.source = req.file.path;
      return doc;
    })
  );
  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
    taskType: TaskType.RETRIEVAL_DOCUMENT,
    title: "Document title",
    apiKey: apiKey,
  });
  try {
    await QdrantVectorStore.fromDocuments(splitDocs, embeddings, {
      url: process.env.QDRANT_URL,
      collectionName,
      apiKey: process.env.QDRANT_API_KEY,
    });

    console.log("Embedding and storage completed ✅");
    return res.status(200).json({ message: "Uploaded successfully" });
  } catch (error) {
    console.error("❌ Failed to store in Qdrant:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/chat", async (req, res) => {
  const useruery = req.query?.message;
  const collectionName = req.query?.collectionName;
  try {
    const queryEmbedding = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004", // 768 dimensions
      taskType: TaskType.RETRIEVAL_QUERY,
      apiKey: apiKey,
    });
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      queryEmbedding,
      {
        url: process.env.QDRANT_URL,
        apiKey: process.env.QDRANT_API_KEY,
        collectionName,
      }
    );

    const results = await vectorStore.similaritySearch(useruery, 3);
    let results2 = [];

    results.map((e) => {
      results2.push({
        pageContent: e.pageContent,
        pageDetails: e.metadata.loc,
      });
    });

    const SYSTEM_PROMPT = `You are a helpful AI assistant who answers user queries . Answer the question using only the given information,
    Information :
      ${JSON.stringify(results2)}
      `;

    const ai = new GoogleGenAI({ apiKey });

    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
    });

    const Chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: SYSTEM_PROMPT,
      },
    });
    const response = await Chat.sendMessage({
      message: useruery,
    });
    return res.status(200).json({ answer: response.text, reference: results2 });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "Internal Server Error" });
  }
});

app.listen(8000, () => console.log(`Server started at port ${8000}`));
