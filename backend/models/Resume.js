const mongoose = require("mongoose")

const achievementSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
})

const educationSchema = new mongoose.Schema({
  institution: {
    type: String,
    required: true,
  },
  location: String,
  degree: {
    type: String,
    required: true,
  },
  fieldOfStudy: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: String,
  description: String,
})

const workExperienceSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: String,
  currentlyWorking: {
    type: Boolean,
    default: false,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: String,
  description: String,
  achievements: [achievementSchema],
})

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  technologies: [String],
  link: String,
  startDate: String,
  endDate: String,
})

const sectionItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
})

const additionalSectionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  items: [sectionItemSchema],
})

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    template: {
      type: String,
      default: "template1",
    },
    personalInfo: {
      fullName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      location: {
        type: String,
        required: true,
      },
      profilePicture: String,
      summary: {
        type: String,
        required: true,
      },
    },
    education: [educationSchema],
    workExperience: [workExperienceSchema],
    skills: [String],
    projects: [projectSchema],
    additionalSections: [additionalSectionSchema],
  },
  {
    timestamps: true,
  },
)

const Resume = mongoose.model("Resume", resumeSchema)

// ✅ Ensure index is created (safe to call on every startup)
Resume.ensureIndexes()

module.exports = Resume