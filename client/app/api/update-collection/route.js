import dbConnect from "@/lib/mongodb";
import Collection from "@/models/collection";
import Chat from "@/models/chat";

export async function POST(req) {
  const { role, description, name } = await req.json();
  try {
    await dbConnect();

    let collection = await Collection.findOne({ name });
    if (!collection) {
      return Response.json(
        { message: "Collection not found" },
        { status: 404 }
      );
    }
    if (collection.used_query === collection.query_limit) {
      return Response.json({ message: "limited quota exced" }, { status: 429 });
    }
    const chat = await Chat.create({
      col_name: name,
      role,
      description,
    });
    if (role === "answer") {
      collection.used_query = collection.used_query + 1;
      await collection.save();
    }
    return Response.json({ collection }, { status: 200 });
  } catch (e) {
    // console.log(e);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
