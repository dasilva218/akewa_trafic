import z4 from "zod/v4";


export const trafficSchema = z4.object({
    latitude: z4.number().min(1, "latitude is required"),
    longitude: z4.number().min(1, "longitude is required"),
    // description: z4.string().min(1, "description is required"),
})

export type TrafficSchema = z4.infer<typeof trafficSchema>
