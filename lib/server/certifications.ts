import { connectToDB } from "../mongodb"
import Certification, { type ICertification } from "@/lib/models/certification"
import { revalidatePath } from "next/cache"

export async function getCertifications() {
  try {
    await connectToDB()
    const certifications = await Certification.find({}).sort({ order: 1, issueDate: -1 }).lean()

    return JSON.parse(JSON.stringify(certifications))
  } catch (error) {
    console.error("Error fetching certifications:", error)
    return []
  }
}

export async function getCertificationById(id: string) {
  try {
    await connectToDB()
    const certification = await Certification.findById(id).lean()

    if (!certification) {
      return null
    }

    return JSON.parse(JSON.stringify(certification))
  } catch (error) {
    console.error(`Error fetching certification with id ${id}:`, error)
    return null
  }
}

export async function createCertification(certificationData: Partial<ICertification>) {
  try {
    await connectToDB()

    // Get the highest order value
    const highestOrder = await Certification.findOne({}).sort({ order: -1 }).select("order").lean()
    const newOrder = highestOrder ? highestOrder.order + 1 : 0

    const newCertification = new Certification({
      ...certificationData,
      order: newOrder,
    })

    await newCertification.save()
    revalidatePath("/")

    return JSON.parse(JSON.stringify(newCertification))
  } catch (error) {
    console.error("Error creating certification:", error)
    throw error
  }
}

export async function updateCertification(id: string, certificationData: Partial<ICertification>) {
  try {
    await connectToDB()

    const updatedCertification = await Certification.findByIdAndUpdate(
      id,
      { ...certificationData },
      { new: true, runValidators: true },
    ).lean()

    if (!updatedCertification) {
      throw new Error(`Certification with id ${id} not found`)
    }

    revalidatePath("/")
    return JSON.parse(JSON.stringify(updatedCertification))
  } catch (error) {
    console.error(`Error updating certification with id ${id}:`, error)
    throw error
  }
}

export async function deleteCertification(id: string) {
  try {
    await connectToDB()

    const deletedCertification = await Certification.findByIdAndDelete(id).lean()

    if (!deletedCertification) {
      throw new Error(`Certification with id ${id} not found`)
    }

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error(`Error deleting certification with id ${id}:`, error)
    throw error
  }
}

export async function updateCertificationsOrder(orderedIds: string[]) {
  try {
    await connectToDB()

    const updateOperations = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order: index } },
      },
    }))

    await Certification.bulkWrite(updateOperations)
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Error updating certifications order:", error)
    throw error
  }
}

