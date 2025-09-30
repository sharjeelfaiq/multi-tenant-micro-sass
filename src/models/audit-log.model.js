import mongoose from "mongoose";

const { Schema, model } = mongoose;

const AuditLogSchema = new Schema(
    {
        tenant: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },

        action: { type: String, required: true },
    },
    {
        timestamps: true
    }
);

export const AuditLogModel = model("AuditLog", AuditLogSchema);
