import mongoose,{Schema} from "mongoose";

const eventSchema = new Schema({
  session_id: { type: String, required: true, index: true },
  event_type: { type: String, required: true },
  page_url: { type: String, required: true },
  timestamp: { type: Number, required: true },
  click_x: Number,
  click_y: Number,
})

export const Event = mongoose.model("event",eventSchema)

