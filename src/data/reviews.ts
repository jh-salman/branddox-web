/**
 * Client reviews – from Fiverr completed orders.
 * Initials used for privacy. Rating/service context from order data.
 */

export type Review = {
  id: string;
  name: string; // masked, e.g. "L."
  rating: number;
  text: string;
  context: string; // e.g. "YouTube Channel Create · Mar 2025"
  subscriberCount?: string; // e.g. "850K subscribers" — optional for display
};

export const reviews: Review[] = [
  {
    id: "1",
    name: "L.",
    rating: 5,
    text: "Exactly what I needed. My channel looks professional now—art, SEO, everything set up perfectly. Delivered on time and very responsive.",
    context: "YouTube Channel Create · Mar 2025",
  },
  {
    id: "2",
    name: "L.",
    rating: 4.3,
    text: "Great work on the channel setup and design. Quick delivery and open to revisions. Happy with the result.",
    context: "YouTube Channel Create · Feb 2025",
  },
  {
    id: "3",
    name: "S.",
    rating: 5,
    text: "Second time ordering. Consistent quality—thumbnails and channel art are on point. Will come back again.",
    context: "YouTube Channel Create · Oct 2024",
  },
  {
    id: "4",
    name: "B.",
    rating: 5,
    text: "Have ordered multiple times. Always delivers fast, communicates clearly, and the channel designs are top notch. Highly recommend.",
    context: "Custom YouTube Package · Jul 2024",
    subscriberCount: "420K subscribers",
  },
  {
    id: "5",
    name: "A.",
    rating: 5,
    text: "Professional from start to finish. Custom package was worth it—got logo, art, SEO and full setup. Very satisfied.",
    context: "Custom Order · Jun 2024",
    subscriberCount: "850K subscribers",
  },
  {
    id: "6",
    name: "Y.",
    rating: 5,
    text: "Fast and reliable. Channel art and optimization done exactly as discussed. Great seller.",
    context: "Custom YouTube Package · Mar 2024",
  },
  {
    id: "7",
    name: "A.",
    rating: 4.7,
    text: "Good experience. Channel setup was clean and delivery was quick. Would order again for other projects.",
    context: "Custom Order · Feb 2024",
  },
  {
    id: "8",
    name: "S.",
    rating: 5,
    text: "STANDARD package was perfect for my budget. Got a complete channel create with design and SEO. Thank you!",
    context: "Standard YouTube Channel Create · Dec 2023",
  },
  {
    id: "9",
    name: "R.",
    rating: 5,
    text: "Ordered multiple premium packages. Quality is consistent and delivery is always on time. My go-to for YouTube channel work.",
    context: "Custom YouTube Package · Mar 2023",
  },
  {
    id: "10",
    name: "J.",
    rating: 5,
    text: "PREMIUM package was worth every dollar. Channel looks amazing and ranks better. Excellent communication.",
    context: "Premium YouTube Channel Create · Jan 2023",
  },
  {
    id: "11",
    name: "V.",
    rating: 5,
    text: "Great work on channel art, logo and SEO. Fast delivery and very professional. Will recommend to others.",
    context: "Custom Order · Dec 2022",
  },
  {
    id: "12",
    name: "J.",
    rating: 5,
    text: "Big project delivered on time. Full channel create with art, logo, SEO—all done well. Thank you!",
    context: "Custom Order · Dec 2021",
  },
];

/** Stats from Fiverr dashboard for social proof */
export const reviewStats = {
  completedOrders: 69,
  cancelled: 4,
  starred: 9,
};
