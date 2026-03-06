const mongoose = require("mongoose");

const BlockSchema = new mongoose.Schema(
    {
        previousHash: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },

        hash: {
            type: String,
            required: true
        }

    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model("StudentBlock", BlockSchema);