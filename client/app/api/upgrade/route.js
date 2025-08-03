import dbConnect from "@/lib/mongodb";
import User from "@/models/user";

export async function POST(req) {
  const { clerk_id } = await req.json();
  try {
    await dbConnect();
    let user = await User.findOne({ clerk_id });
    console.log(clerk_id);
    console.log(user);
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }
    if (user.createdCollection === user.collectionLimit) {
      return Response.json({ message: "limited quota exced" }, { status: 429 });
    }

    user.collectionLimit = 7;
    user.role = "subscribedUser";
    await user.save();

    return Response.json({ user }, { status: 200 });
  } catch (e) {
    // console.log(e);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
