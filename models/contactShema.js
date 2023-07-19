import { Schema, model } from "mongoose";
import Joi from "joi";

const ContactShema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

export const addSchema = Joi.object({
  phone: Joi.string().required(),
  email: Joi.string().required(),
  name: Joi.string().required(),
  favorite: Joi.bool(),
});

export const favoriteSchema = Joi.object({
  favorite: Joi.bool().required(),
});

const Contact = model("Contact", ContactShema);
export default Contact;
