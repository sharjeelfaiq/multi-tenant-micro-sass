import mongoose from "mongoose";

const { Schema, model } = mongoose;

const TenantSchema = new Schema(
  {
    subdomain: { type: String, required: true, unique: true },

    name: { type: String },
  },
  {
    timestamps: true,
  },
);

export const TenantModel = model("Tenant", TenantSchema);
