import { IndustryContent } from "./types";

const defaultPainPoints = [
  {
    title: "Outdated Design",
    description: "Your current website looks like it was built a decade ago. Customers judge your business by your online presence.",
    icon: "palette",
  },
  {
    title: "Not Mobile-Friendly",
    description: "Over 60% of Australians browse on mobile. If your site isn't responsive, you're losing jobs every day.",
    icon: "smartphone",
  },
  {
    title: "Slow Load Times",
    description: "Slow websites kill conversions. Every second of delay costs you potential customers who go to competitors.",
    icon: "clock",
  },
  {
    title: "No Online Bookings",
    description: "Customers expect to book or enquire online. Without clear CTAs, they move on to the next search result.",
    icon: "calendar",
  },
];

const defaultFeatures = [
  { title: "Modern, Professional Design", description: "A clean, contemporary layout that builds instant trust with potential customers." },
  { title: "Mobile-First Responsive", description: "Looks perfect on every device — phone, tablet, and desktop." },
  { title: "SEO-Optimised Structure", description: "Built with search engines in mind so local customers can find you." },
  { title: "Clear Call-to-Action", description: "Strategic placement of contact buttons and enquiry forms to convert visitors." },
  { title: "Fast Loading Speed", description: "Optimised for performance so customers don't bounce before seeing your work." },
  { title: "Content Preservation", description: "We keep your existing content and restructure it for maximum impact." },
];

const industrySpecific: Record<string, Partial<IndustryContent>> = {
  plumbers: {
    headline: "Website Redesign for Plumbers",
    subheadline: "Turn your outdated plumbing website into a lead-generating machine. AI-powered redesign in minutes, not months.",
    painPoints: [
      { title: "Emergency Calls Going to Competitors", description: "When a pipe bursts at 2am, customers Google 'emergency plumber.' If your site looks dodgy, they'll call someone else.", icon: "alert-triangle" },
      { title: "No Before/After Gallery", description: "Plumbing customers want to see your work. Without a modern gallery, you can't showcase your expertise.", icon: "image" },
      { title: "Hard to Find Services", description: "Blocked drains, hot water, gas fitting — customers can't find what they need on a cluttered, outdated site.", icon: "search" },
      { title: "Missing Trust Signals", description: "No licence numbers, insurance details, or reviews visible. Customers need to trust you before they let you in their home.", icon: "shield" },
    ],
    faqs: [
      { question: "How long does a plumbing website redesign take?", answer: "With webfacelift, you get a complete modern redesign in under 5 minutes. Just paste your current website URL and our AI handles the rest. You can then iterate and refine using our chat interface." },
      { question: "Will my existing content be preserved?", answer: "Yes. Our AI scrapes and analyses your current website, preserving all your service descriptions, contact details, and business information while restructuring it into a modern, professional layout." },
      { question: "Can I add online booking to my plumbing website?", answer: "Absolutely. During the chat iteration phase, you can ask the AI to add booking forms, contact forms, and emergency call-to-action buttons to your redesigned site." },
      { question: "How much does a plumbing website redesign cost?", answer: "webfacelift starts from just $9 per project — a fraction of what traditional web designers charge. You get a complete, modern redesign that you can export and use immediately." },
    ],
  },
  electricians: {
    headline: "Website Redesign for Electricians",
    subheadline: "Upgrade your electrical business website to match the quality of your work. Modern designs that generate leads.",
    painPoints: [
      { title: "Licence & Credentials Hidden", description: "Customers need to see your electrical licence, insurance, and certifications upfront. Outdated sites bury this critical information.", icon: "award" },
      { title: "Emergency Services Not Prominent", description: "24/7 emergency electricians need their availability front and centre. Old layouts hide your biggest selling point.", icon: "zap" },
      { title: "Service Areas Unclear", description: "Customers don't know if you cover their suburb. Without clear service area info, they move on.", icon: "map-pin" },
      { title: "No Customer Reviews", description: "Social proof is everything for trades. If your reviews aren't visible, customers can't trust your work.", icon: "star" },
    ],
    faqs: [
      { question: "How long does an electrician website redesign take?", answer: "With webfacelift, your new design is ready in under 5 minutes. Paste your URL, let our AI analyse your content, and get a modern redesign you can refine instantly." },
      { question: "Can I show my electrical licence on the new site?", answer: "Yes. Our AI preserves and prominently displays your credentials, licence numbers, and certifications. You can also add trust badges during the chat iteration phase." },
      { question: "Will the redesign help me rank on Google?", answer: "Our redesigns use SEO-optimised structure, proper headings, meta tags, and schema markup — all designed to help your electrical business rank better in local search results." },
      { question: "Can I add an emergency contact button?", answer: "Absolutely. Emergency CTAs, click-to-call buttons, and 24/7 availability banners can all be added to your redesigned site." },
    ],
  },
  restaurants: {
    headline: "Website Redesign for Restaurants",
    subheadline: "Your food deserves a website that looks as good as your dishes. AI-powered redesign for restaurants and eateries.",
    painPoints: [
      { title: "Menu Not Mobile-Friendly", description: "Customers check your menu on their phone before deciding where to eat. PDF menus and tiny text drive them to competitors.", icon: "smartphone" },
      { title: "No Online Reservations", description: "Diners expect to book a table online. Without it, you're losing covers every night.", icon: "calendar" },
      { title: "Photos Don't Do Justice", description: "Your food is amazing, but your website makes it look amateur. Poor image presentation kills appetite appeal.", icon: "image" },
      { title: "Outdated Vibe", description: "Your restaurant's atmosphere is modern and inviting, but your website screams 2012. First impressions matter.", icon: "palette" },
    ],
    faqs: [
      { question: "Can the redesign include our full menu?", answer: "Yes. Our AI preserves your entire menu and presents it in a clean, mobile-friendly format. No more PDF downloads — customers can browse your dishes beautifully on any device." },
      { question: "Will it work with our booking system?", answer: "Your redesigned site can include links to your existing booking platform (OpenTable, ResDiary, etc.) or embedded booking widgets." },
      { question: "How do we update the menu later?", answer: "The redesigned site gives you a modern template. You can export the code and make changes, or run another iteration through our chat interface anytime." },
      { question: "Can we show our Instagram feed?", answer: "During the chat iteration phase, you can request social media integration, including Instagram galleries showcasing your dishes." },
    ],
  },
  dentists: {
    headline: "Website Redesign for Dentists",
    subheadline: "Build patient trust with a modern dental website. Professional designs that convert visitors into appointments.",
    painPoints: [
      { title: "Patients Don't Feel Comfortable", description: "Dental anxiety is real. An outdated website amplifies fear instead of building the trust patients need.", icon: "heart" },
      { title: "Services Not Clear", description: "General dentistry, cosmetic, orthodontics — patients can't find the treatment they need on a cluttered site.", icon: "search" },
      { title: "No Online Booking", description: "Modern patients want to book appointments online, especially new patients who haven't committed yet.", icon: "calendar" },
      { title: "Missing Before/After", description: "Cosmetic dentistry patients need to see results. Without a gallery, you can't showcase your smile transformations.", icon: "image" },
    ],
    faqs: [
      { question: "Is the dental website design AHPRA compliant?", answer: "Our AI generates professional, clean layouts. You should review the final content to ensure compliance with AHPRA advertising guidelines for your specific practice." },
      { question: "Can I add patient testimonials?", answer: "Yes. You can add testimonial sections during the chat iteration phase, ensuring they comply with healthcare advertising regulations." },
      { question: "Will it include a treatment page for each service?", answer: "Our AI analyses your current site structure and can create dedicated sections for each service you offer, from general check-ups to cosmetic procedures." },
      { question: "How quickly can I get a new dental website?", answer: "Your redesign is ready in under 5 minutes. Paste your current URL, review the AI-generated design, and refine it using our chat interface." },
    ],
  },
  lawyers: {
    headline: "Website Redesign for Lawyers",
    subheadline: "Command authority online with a modern law firm website. Professional designs that convert enquiries into clients.",
    painPoints: [
      { title: "Doesn't Convey Authority", description: "Clients need to trust you with their legal matters. An outdated website undermines your professional credibility.", icon: "shield" },
      { title: "Practice Areas Buried", description: "Family law, criminal, commercial — clients can't find their specific legal need on a cluttered, outdated site.", icon: "search" },
      { title: "No Clear Next Step", description: "Potential clients visit your site but don't know how to engage. Without clear CTAs, they go to another firm.", icon: "phone" },
      { title: "Team Profiles Outdated", description: "Clients want to know who'll handle their matter. Outdated bios with old photos don't build confidence.", icon: "users" },
    ],
    faqs: [
      { question: "Will the design look professional enough for a law firm?", answer: "Absolutely. Our AI generates sophisticated, authoritative designs that convey trust and professionalism — exactly what legal clients expect." },
      { question: "Can we have separate pages for each practice area?", answer: "Yes. Our AI can structure your site with dedicated sections for each area of law you practice, making it easy for clients to find relevant information." },
      { question: "Is the design suitable for regulatory compliance?", answer: "Our designs create clean, professional layouts. You should review the final content to ensure compliance with your state's legal profession regulations." },
      { question: "Can we add a blog or resources section?", answer: "During the chat iteration phase, you can request additional sections like legal resources, blog layouts, and downloadable guides." },
    ],
  },
  accountants: {
    headline: "Website Redesign for Accountants",
    subheadline: "Your numbers are precise — your website should be too. Modern designs that attract business clients.",
    painPoints: [
      { title: "Looks Like Everyone Else", description: "Generic accounting websites blend together. Stand out from the hundreds of other firms in your area.", icon: "copy" },
      { title: "Services Poorly Organised", description: "Tax, BAS, bookkeeping, advisory — clients can't find what they need when services are listed in a wall of text.", icon: "list" },
      { title: "No Client Portal Link", description: "Clients expect easy access to their portal. Burying the login link frustrates existing clients.", icon: "lock" },
      { title: "Tax Season Opportunities Missed", description: "No seasonal CTAs or deadline reminders. You're missing the biggest lead generation opportunity of the year.", icon: "calendar" },
    ],
    faqs: [
      { question: "Can the website highlight tax deadlines?", answer: "Yes. You can add seasonal banners, deadline countdowns, and tax-time CTAs during the chat iteration phase." },
      { question: "Will it integrate with our accounting software?", answer: "Your redesigned site can include links to client portals (Xero, MYOB, QuickBooks) and embedded booking widgets for consultations." },
      { question: "How do we show our team's qualifications?", answer: "Our AI creates professional team sections with bios, qualifications (CPA, CA, etc.), and specialisations clearly displayed." },
      { question: "Can we target specific business types?", answer: "Absolutely. During iteration, you can add dedicated sections targeting tradies, startups, medical professionals, or any niche you serve." },
    ],
  },
  builders: {
    headline: "Website Redesign for Builders",
    subheadline: "Showcase your builds with a website that's as solid as your work. Modern designs that win more projects.",
    painPoints: [
      { title: "Portfolio Looks Amateur", description: "Your builds are stunning but your website gallery makes them look average. High-quality project showcases win contracts.", icon: "image" },
      { title: "No Project Process Info", description: "Clients want to understand your build process. Without clear stages, they worry about what they're getting into.", icon: "list" },
      { title: "Missing Credentials", description: "Licence numbers, HIA membership, insurance — these trust signals are buried or missing entirely.", icon: "award" },
      { title: "Can't Handle Enquiries", description: "No quote request form, no project brief template. You're making it hard for serious clients to reach out.", icon: "mail" },
    ],
  },
  "real-estate-agents": {
    headline: "Website Redesign for Real Estate Agents",
    subheadline: "In real estate, image is everything. Get a website that matches the properties you sell.",
    painPoints: [
      { title: "Listings Look Flat", description: "Your properties deserve cinematic presentation. Outdated layouts can't showcase homes the way buyers expect.", icon: "home" },
      { title: "No Market Authority", description: "Buyers and sellers want a local expert. Your website should position you as the go-to agent in your area.", icon: "trending-up" },
      { title: "Appraisal Requests Lost", description: "The most valuable lead a real estate agent gets — and your site makes it hard to request one.", icon: "search" },
      { title: "Personal Brand Missing", description: "Real estate is personal. Cookie-cutter franchise templates don't show what makes you different.", icon: "user" },
    ],
  },
  "beauty-salons": {
    headline: "Website Redesign for Beauty Salons",
    subheadline: "Your salon is all about aesthetics — your website should be too. Stunning designs that book more appointments.",
    painPoints: [
      { title: "Doesn't Match Your Vibe", description: "Your salon is Instagram-worthy but your website looks like it was built in Wix 10 years ago.", icon: "palette" },
      { title: "No Online Booking", description: "Clients want to book at 10pm on Sunday. Without online booking, you lose them to salons that have it.", icon: "calendar" },
      { title: "Services & Pricing Hidden", description: "Clients want to see your menu and prices before booking. Making them call puts up an unnecessary barrier.", icon: "list" },
      { title: "Before/After Not Showcased", description: "Hair transformations, nail art, skin treatments — visual proof is everything in beauty.", icon: "image" },
    ],
  },
  gyms: {
    headline: "Website Redesign for Gyms",
    subheadline: "Get a gym website that's as high-energy as your workouts. Convert visitors into members.",
    painPoints: [
      { title: "Membership Info Buried", description: "Pricing, class schedules, and membership options are the first things people look for. Don't make them hunt.", icon: "credit-card" },
      { title: "No Virtual Tour Feel", description: "People want to see the facility before visiting. Your website should make them feel like they're already there.", icon: "image" },
      { title: "Class Timetable Outdated", description: "If your timetable is a PDF or an image, members will stop checking and start skipping classes.", icon: "calendar" },
      { title: "No Social Proof", description: "Transformation stories and member testimonials drive sign-ups. An old site hides your best marketing asset.", icon: "users" },
    ],
  },
  photographers: {
    headline: "Website Redesign for Photographers",
    subheadline: "Your photos tell stories — your website should too. Portfolio designs that book more clients.",
    painPoints: [
      { title: "Portfolio Loads Slowly", description: "Heavy, unoptimised images on an old platform make potential clients wait. They won't.", icon: "clock" },
      { title: "Work Gets Lost", description: "Your best shots are buried in endless scrolling galleries. A modern layout curates your work for maximum impact.", icon: "layout" },
      { title: "No Clear Packages", description: "Wedding, portrait, commercial — clients want to see what you offer and what it costs before enquiring.", icon: "package" },
      { title: "Mobile Experience Terrible", description: "Instagram-generation clients browse on mobile. If your portfolio doesn't shine on a phone, you've lost them.", icon: "smartphone" },
    ],
  },
  "cleaning-services": {
    headline: "Website Redesign for Cleaning Services",
    subheadline: "A spotless website for your spotless service. Modern designs that turn visitors into regular clients.",
    painPoints: [
      { title: "No Trust Signals", description: "Letting strangers into your home requires trust. Without visible insurance, reviews, and credentials, clients hesitate.", icon: "shield" },
      { title: "Services Unclear", description: "Domestic, commercial, end-of-lease, carpet — clients need to quickly find and understand your specific services.", icon: "list" },
      { title: "No Instant Quoting", description: "Clients want a ballpark price before calling. Without a quick quote option, they go to competitors who offer one.", icon: "calculator" },
      { title: "Looks Unprofessional", description: "An outdated website suggests an unprofessional service. First impressions determine whether clients enquire.", icon: "palette" },
    ],
  },
};

export function getIndustryContent(slug: string): IndustryContent {
  const specific = industrySpecific[slug] || {};
  const industry = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    slug,
    headline: specific.headline || `Website Redesign for ${industry}`,
    subheadline: specific.subheadline || `Transform your ${slug.replace(/-/g, " ")} website into a modern, lead-generating machine with AI-powered redesign.`,
    painPoints: specific.painPoints || defaultPainPoints,
    features: specific.features || defaultFeatures,
    faqs: specific.faqs || [
      { question: `How long does a ${slug.replace(/-/g, " ")} website redesign take?`, answer: "With webfacelift, your complete redesign is ready in under 5 minutes. Paste your current website URL, let our AI analyse and restructure your content, then refine it using our chat interface." },
      { question: "Will my existing content be preserved?", answer: "Yes. Our AI scrapes your current website and preserves all your content — services, contact details, team info, and more. It restructures everything into a modern, professional layout." },
      { question: "How much does it cost?", answer: "webfacelift starts from just $9 per project — a tiny fraction of what a traditional web designer would charge for a complete redesign." },
      { question: "Can I make changes after the initial redesign?", answer: "Absolutely. Our chat-based editor lets you refine every aspect of your new design. Change colours, add sections, update content — all through simple conversation." },
    ],
  };
}
