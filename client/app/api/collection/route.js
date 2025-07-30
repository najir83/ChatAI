import dbConnect from "@/lib/mongodb";
import User from "@/models/user";
import Collection from "@/models/collection";
import Chat from "@/models/chat";

export async function POST(req) {
  const { clerk_id, name } = await req.json();
  try {
    await dbConnect();
    let user = await User.findOne({ clerk_id });
    let collection = await Collection.findOne({ name });
    if (collection) {
      return Response.json(
        { message: "Collection already exits" },
        { status: 409 }
      );
    }
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }
    if (user.createdCollection === user.collectionLimit) {
      return Response.json({ message: "limited quota exced" }, { status: 429 });
    }

    collection = await Collection.create({
      name,
      clerk_id,
    });
    

    user.createdCollection = user.createdCollection + 1;
    await user.save();
    return Response.json({ user, collection }, { status: 200 });
  } catch (e) {
    // console.log(e);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const col_name = searchParams.get("col_name");
  try {
    await dbConnect();
    const chats = await Chat.find({ col_name });

    return Response.json({ chats }, { status: 200 });
  } catch (e) {
    // console.log(e);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}