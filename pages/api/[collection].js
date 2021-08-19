import mongoConnect from "../../utils/mongoConnect"

export default async function handler(req, res) {
  const { collection } = req.query
  const { db } = await mongoConnect()
  const data = await db.collection(collection).find().toArray()
  res.status(200).json(data)
}