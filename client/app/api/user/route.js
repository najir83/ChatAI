import dbConnect from "@/lib/mongodb";
import User from "@/models/user";
import Collection from "@/models/collection";

export async function POST(req) {
  const { clerk_id, name } = await req.json();
  try {
    await dbConnect();
    let user = await User.findOne({ clerk_id });
    const collections = await Collection.find({ clerk_id });
    if (!user) {
      user = await User.create({
        name,
        clerk_id,
      });
    }

    return Response.json({ user ,collections}, { status: 200 });
  } catch (e) {
    // console.log(e);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const clerk_id = searchParams.get("clerk_id");

  try {
    await dbConnect();
    const collections = await Collection.find({ clerk_id }).select(
      "-query_reset_time -__v"
    );

    return Response.json({ collections }, { status: 200 });
  } catch (e) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
