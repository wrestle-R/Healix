const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "senderModel",
    },
    senderModel: {
      type: String,
      required: true,
      enum: ["Doctor", "Patient"],
    },
    messageType: {
      type: String,
      enum: ["text", "image", "document", "video_call_start", "video_call_end"],
      default: "text",
    },
    content: {
      type: String,
      required: true,
    },
    // Cloudinary file details
    fileDetails: {
      cloudinaryUrl: { type: String, default: "" },
      cloudinaryPublicId: { type: String, default: "" },
      originalFileName: { type: String, default: "" },
      fileType: { type: String, default: "" }, // pdf, doc, jpg, png, etc.
      fileSize: { type: Number, default: 0 }, // in bytes
      thumbnail: { type: String, default: "" }, // For document previews
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const chatSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },
    messages: [messageSchema],
    lastMessage: {
      type: messageSchema,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Typing indicators
    doctorTyping: {
      type: Boolean,
      default: false,
    },
    patientTyping: {
      type: Boolean,
      default: false,
    },
    // Unread counts
    doctorUnreadCount: {
      type: Number,
      default: 0,
    },
    patientUnreadCount: {
      type: Number,
      default: 0,
    },
    // Chat settings
    isMuted: {
      doctor: { type: Boolean, default: false },
      patient: { type: Boolean, default: false },
    },
    // Video call related
    activeVideoCall: {
      isActive: { type: Boolean, default: false },
      roomId: { type: String, default: "" },
      startedBy: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "activeVideoCall.startedByModel",
        default: null,
      },
      startedByModel: {
        type: String,
        enum: ["Doctor", "Patient"],
        default: null,
      },
      startedAt: { type: Date },
      participants: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "activeVideoCall.participants.userModel",
          },
          userModel: {
            type: String,
            enum: ["Doctor", "Patient"],
          },
          joinedAt: { type: Date },
          leftAt: { type: Date },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
chatSchema.index({ doctorId: 1, patientId: 1 }, { unique: true });
chatSchema.index({ doctorId: 1 });
chatSchema.index({ patientId: 1 });
chatSchema.index({ appointmentId: 1 });
chatSchema.index({ "messages.createdAt": -1 });

// Method to add a new message
chatSchema.methods.addMessage = function (messageData) {
  const message = {
    ...messageData,
    _id: new mongoose.Types.ObjectId(),
  };

  this.messages.push(message);
  this.lastMessage = message;

  // Update unread counts
  if (messageData.senderModel === "Doctor") {
    this.patientUnreadCount += 1;
  } else {
    this.doctorUnreadCount += 1;
  }

  return message;
};

// Method to mark messages as read
chatSchema.methods.markAsRead = function (userId, userModel) {
  const unreadMessages = this.messages.filter(
    (msg) =>
      !msg.isRead &&
      (msg.senderId.toString() !== userId.toString() ||
        msg.senderModel !== userModel)
  );

  unreadMessages.forEach((msg) => {
    msg.isRead = true;
    msg.readAt = new Date();
  });

  // Reset unread count
  if (userModel === "Doctor") {
    this.doctorUnreadCount = 0;
  } else {
    this.patientUnreadCount = 0;
  }

  return unreadMessages.length;
};

// Method to start video call
chatSchema.methods.startVideoCall = function (startedBy, startedByModel) {
  const roomId = `call_${this._id}_${Date.now()}`;

  this.activeVideoCall = {
    isActive: true,
    roomId: roomId,
    startedBy: startedBy,
    startedByModel: startedByModel,
    startedAt: new Date(),
    participants: [
      {
        userId: startedBy,
        userModel: startedByModel,
        joinedAt: new Date(),
      },
    ],
  };

  // Add system message
  this.addMessage({
    senderId: startedBy,
    senderModel: startedByModel,
    messageType: "video_call_start",
    content: "Video call started",
  });

  return roomId;
};

// Method to end video call
chatSchema.methods.endVideoCall = function (endedBy, endedByModel) {
  if (this.activeVideoCall.isActive) {
    this.activeVideoCall.isActive = false;

    // Add system message
    this.addMessage({
      senderId: endedBy,
      senderModel: endedByModel,
      messageType: "video_call_end",
      content: "Video call ended",
    });
  }
};

module.exports = mongoose.model("Chat", chatSchema);
