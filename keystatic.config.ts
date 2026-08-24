import { config, collection, singleton, fields } from "@keystatic/core";

const imageField = (label: string) =>
  fields.image({
    label,
    directory: "public/assets/",
    publicPath: "/assets/",
  });

// Every value here must exist in the `paths` dictionary in
// src/components/Icon.astro — that file is the icon library. Add the drawing
// there first, then add it here to make it selectable in the CMS.
const ICON_OPTIONS = [
  { label: "Bar chart", value: "chart" },
  { label: "Briefcase", value: "briefcase" },
  { label: "Briefcase (alt)", value: "proBriefcase" },
  { label: "Calculator", value: "calculator" },
  { label: "Clock", value: "clock" },
  { label: "Construction", value: "construction" },
  { label: "Crosshair", value: "crosshair" },
  { label: "Desk (executive assistance)", value: "executive" },
  { label: "Document list (administrative)", value: "admin" },
  { label: "Dollar", value: "dollar" },
  { label: "Envelope", value: "envelope" },
  { label: "Headset (customer support)", value: "customer" },
  { label: "Heart", value: "heart" },
  { label: "House", value: "realestate" },
  { label: "Ledger (bookkeeping)", value: "bookkeeping" },
  { label: "Lightbulb", value: "bulb" },
  { label: "Megaphone", value: "megaphone" },
  { label: "Partnership", value: "partnership" },
  { label: "Person", value: "person" },
  { label: "Phone", value: "phone" },
  { label: "Pulse", value: "pulse" },
  { label: "Rocket", value: "rocket" },
  { label: "Scales", value: "scales" },
  { label: "Shield", value: "shield" },
  { label: "Shopping cart", value: "cart" },
  { label: "Target", value: "target" },
  { label: "Tooth", value: "tooth" },
  { label: "Truck", value: "truck" },
] as const;

type IconName = (typeof ICON_OPTIONS)[number]["value"];

const iconField = (label: string, defaultValue: IconName = "shield") =>
  fields.select({
    label,
    options: ICON_OPTIONS,
    defaultValue,
  });

const eyebrowFields = {
  eyebrow: fields.text({ label: "Eyebrow label" }),
  eyebrowColor: fields.select({
    label: "Eyebrow color",
    options: [
      { label: "Yellow", value: "yellow" },
      { label: "Green", value: "green" },
      { label: "Red", value: "red" },
    ],
    defaultValue: "yellow",
  }),
  eyebrowLarge: fields.checkbox({
    label: "Large eyebrow",
    defaultValue: false,
  }),
};

const buttonFields = {
  label: fields.text({ label: "Button label" }),
  href: fields.text({ label: "Button link", defaultValue: "/contact" }),
  variant: fields.select({
    label: "Button style",
    options: [
      { label: "Yellow", value: "yellow" },
      { label: "Dark", value: "dark" },
      { label: "Outline Dark", value: "outline-dark" },
      { label: "Outline Light", value: "outline-light" },
    ],
    defaultValue: "yellow",
  }),
};

const sectionBase = {
  sectionId: fields.text({ label: "Section ID (optional)", defaultValue: "" }),
};

const sectionDiscriminant = fields.select({
  label: "Section Type",
  options: [
    { label: "Reusable section", value: "reusable" },
    { label: "Hero", value: "hero" },
    { label: "Inner Hero", value: "innerHero" },
    { label: "Stats bar", value: "statsBar" },
    { label: "Service grid", value: "serviceGrid" },
    { label: "Why choose us", value: "whyChooseUs" },
    { label: "Industries grid", value: "industriesGrid" },
    { label: "Global reach", value: "globalReach" },
    { label: "Testimonial feature", value: "testimonialFeature" },
    { label: "CTA band", value: "ctaBand" },
    { label: "About stats", value: "aboutStats" },
    { label: "Founder", value: "founder" },
    { label: "Vision / Mission", value: "visionMission" },
    { label: "Team", value: "team" },
    { label: "How we work", value: "howWeWork" },
    { label: "Service cards", value: "serviceCards" },
    { label: "Engagement steps", value: "engagementSteps" },
    { label: "Featured testimonial", value: "featuredTestimonial" },
    { label: "Testimonials grid", value: "testimonialsGrid" },
    { label: "Closing band", value: "closingBand" },
    { label: "Contact section", value: "contactSection" },
    { label: "Not found", value: "notFound" },
    { label: "Service detail", value: "serviceDetail" },
  ],
  defaultValue: "hero",
});

const createSectionConditional = (includeReusable: boolean) =>
  fields.conditional(sectionDiscriminant, {
    reusable: fields.object({
      section: fields.relationship({
        label: "Reusable section",
        collection: "reusableSections",
      }),
    }),
    hero: fields.object({
      ...sectionBase,
      backgroundImage: imageField("Background image"),
      backgroundPosition: fields.text({
        label: "Background position",
        defaultValue: "58% 55%",
      }),
      eyebrow: fields.text({
        label: "Eyebrow label",
        defaultValue: "Mandrex VA Services",
      }),
      headline: fields.text({ label: "Headline" }),
      lead: fields.text({ label: "Lead paragraph" }),
      primaryButton: fields.object(buttonFields, { label: "Primary button" }),
      secondaryButton: fields.object(buttonFields, {
        label: "Secondary button",
      }),
      stats: fields.array(
        fields.object({
          value: fields.text({ label: "Value" }),
          label: fields.text({ label: "Label" }),
          accent: fields.checkbox({
            label: "Accent style",
            defaultValue: false,
          }),
        }),
        { label: "Stats", itemLabel: (props) => props.fields.label.value },
      ),
    }),
    innerHero: fields.object({
      ...sectionBase,
      backgroundImage: imageField("Background image"),
      backgroundPosition: fields.text({
        label: "Background position",
        defaultValue: "50% 45%",
      }),
      eyebrow: fields.text({ label: "Eyebrow label" }),
      headline: fields.text({ label: "Headline" }),
      lead: fields.text({ label: "Lead paragraph" }),
      tagline: fields.text({ label: "Tagline (optional)", defaultValue: "" }),
      breadcrumb: fields.object(
        {
          parentLabel: fields.text({ label: "Parent label", defaultValue: "" }),
          parentHref: fields.text({ label: "Parent href", defaultValue: "" }),
        },
        { label: "Breadcrumb" },
      ),
      buttons: fields.array(fields.object(buttonFields), {
        label: "Buttons",
        itemLabel: (props) => props.fields.label.value,
      }),
      chips: fields.array(fields.text({ label: "Chip" }), {
        label: "Chips",
        itemLabel: (props) => props.value,
      }),
      facts: fields.array(
        fields.object({
          label: fields.text({ label: "Label" }),
          value: fields.text({ label: "Value" }),
        }),
        { label: "Facts", itemLabel: (props) => props.fields.label.value },
      ),
    }),
    statsBar: fields.object({
      ...sectionBase,
      stats: fields.array(
        fields.object({
          value: fields.text({ label: "Value" }),
          label: fields.text({ label: "Label" }),
          accent: fields.checkbox({
            label: "Accent style",
            defaultValue: false,
          }),
        }),
        { label: "Stats", itemLabel: (props) => props.fields.label.value },
      ),
    }),
    serviceGrid: fields.object({
      ...sectionBase,
      eyebrow: fields.text({
        label: "Eyebrow label",
        defaultValue: "What we do",
      }),
      title: fields.text({ label: "Title" }),
      showAllButton: fields.object(buttonFields, { label: "Show all button" }),
    }),
    whyChooseUs: fields.object({
      ...sectionBase,
      backgroundImage: imageField("Background image"),
      eyebrow: fields.text({
        label: "Eyebrow label",
        defaultValue: "Why choose us",
      }),
      title: fields.text({ label: "Title" }),
      intro: fields.text({ label: "Intro paragraph" }),
      tiles: fields.array(
        fields.object({
          icon: iconField("Icon"),
          title: fields.text({ label: "Title" }),
          description: fields.text({ label: "Description" }),
        }),
        { label: "Tiles", itemLabel: (props) => props.fields.title.value },
      ),
    }),
    industriesGrid: fields.object({
      ...sectionBase,
      eyebrow: fields.text({
        label: "Eyebrow label",
        defaultValue: "Industries",
      }),
      title: fields.text({ label: "Title" }),
      description: fields.text({ label: "Description" }),
      ctaTitle: fields.text({
        label: "CTA tile title",
        defaultValue: "Not listed?",
      }),
      ctaDescription: fields.text({
        label: "CTA tile description",
        defaultValue: "Tell us what your operations need →",
      }),
      ctaHref: fields.text({
        label: "CTA tile link",
        defaultValue: "/contact",
      }),
    }),
    globalReach: fields.object({
      ...sectionBase,
      mainImage: imageField("Main image"),
      insetImage: imageField("Inset image"),
      eyebrow: fields.text({
        label: "Eyebrow label",
        defaultValue: "Global reach",
      }),
      title: fields.text({ label: "Title" }),
      description: fields.text({ label: "Description" }),
      stats: fields.array(
        fields.object({
          value: fields.text({ label: "Value" }),
          label: fields.text({ label: "Label" }),
        }),
        { label: "Stats", itemLabel: (props) => props.fields.label.value },
      ),
    }),
    testimonialFeature: fields.object({
      ...sectionBase,
      quote: fields.text({ label: "Quote" }),
      authorInitials: fields.text({ label: "Author initials" }),
      authorName: fields.text({ label: "Author name" }),
      authorRole: fields.text({ label: "Author role" }),
      heading: fields.text({ label: "Right column heading" }),
      checks: fields.array(fields.text({ label: "Check item" }), {
        label: "Checklist",
        itemLabel: (props) => props.value,
      }),
      button: fields.object(buttonFields, { label: "Button" }),
    }),
    ctaBand: fields.object({
      ...sectionBase,
      variant: fields.select({
        label: "Variant",
        options: [
          { label: "Green", value: "green" },
          { label: "Dark", value: "dark" },
        ],
        defaultValue: "green",
      }),
      heading: fields.text({ label: "Heading" }),
      paragraph: fields.text({ label: "Paragraph" }),
      button: fields.object(buttonFields, { label: "Button" }),
    }),
    aboutStats: fields.object({
      ...sectionBase,
      stats: fields.array(
        fields.object({
          value: fields.text({ label: "Value" }),
          label: fields.text({ label: "Label" }),
        }),
        { label: "Stats", itemLabel: (props) => props.fields.label.value },
      ),
    }),
    founder: fields.object({
      ...sectionBase,
      photo: imageField("Founder photo"),
      photoPosition: fields.text({
        label: "Photo object position",
        defaultValue: "center 20%",
      }),
      name: fields.text({ label: "Founder name" }),
      role: fields.text({ label: "Founder role" }),
      eyebrow: fields.text({
        label: "Eyebrow label",
        defaultValue: "Founder's note",
      }),
      title: fields.text({ label: "Title" }),
      paragraphs: fields.array(fields.text({ label: "Paragraph" }), {
        label: "Paragraphs",
        itemLabel: (props) => props.value.slice(0, 60) + "...",
      }),
      missionStatement: fields.text({ label: "Mission statement" }),
    }),
    visionMission: fields.object({
      ...sectionBase,
      cards: fields.array(
        fields.object({
          icon: iconField("Icon"),
          title: fields.text({ label: "Title" }),
          description: fields.text({ label: "Description" }),
          color: fields.select({
            label: "Accent color",
            options: [
              { label: "Green", value: "green" },
              { label: "Red", value: "red" },
            ],
            defaultValue: "green",
          }),
        }),
        { label: "Cards", itemLabel: (props) => props.fields.title.value },
      ),
    }),
    team: fields.object({
      ...sectionBase,
      backgroundImage: imageField("Background image"),
      title: fields.text({ label: "Title" }),
      description: fields.text({ label: "Description" }),
      members: fields.array(
        fields.object({
          value: fields.text({ label: "Value / number" }),
          title: fields.text({ label: "Title" }),
          description: fields.text({ label: "Description" }),
        }),
        { label: "Team tiles", itemLabel: (props) => props.fields.title.value },
      ),
    }),
    howWeWork: fields.object({
      ...sectionBase,
      title: fields.text({ label: "Title" }),
      items: fields.array(
        fields.object({
          icon: iconField("Icon"),
          title: fields.text({ label: "Title" }),
          description: fields.text({ label: "Description" }),
        }),
        { label: "Items", itemLabel: (props) => props.fields.title.value },
      ),
    }),
    serviceCards: fields.object({
      ...sectionBase,
      descriptionOverrides: fields.array(
        fields.object({
          service: fields.relationship({
            label: "Service",
            collection: "services",
          }),
          description: fields.text({ label: "Card description override" }),
        }),
        {
          label: "Description overrides",
          itemLabel: (props) => props.fields.service.value || "Override",
        },
      ),
    }),
    engagementSteps: fields.object({
      ...sectionBase,
      title: fields.text({ label: "Title" }),
      steps: fields.array(
        fields.object({
          number: fields.text({ label: "Number" }),
          title: fields.text({ label: "Title" }),
          description: fields.text({ label: "Description" }),
        }),
        { label: "Steps", itemLabel: (props) => props.fields.title.value },
      ),
    }),
    featuredTestimonial: fields.object({
      ...sectionBase,
      quote: fields.text({ label: "Quote" }),
      authorInitials: fields.text({ label: "Author initials" }),
      authorName: fields.text({ label: "Author name" }),
      authorRole: fields.text({ label: "Author role" }),
      stats: fields.array(
        fields.object({
          value: fields.text({ label: "Value" }),
          label: fields.text({ label: "Label" }),
        }),
        { label: "Stats", itemLabel: (props) => props.fields.label.value },
      ),
    }),
    testimonialsGrid: fields.object({
      ...sectionBase,
      ctaTitle: fields.text({
        label: "CTA title",
        defaultValue: "Your story next",
      }),
      ctaDescription: fields.text({ label: "CTA description" }),
      ctaButton: fields.object(buttonFields, { label: "CTA button" }),
    }),
    closingBand: fields.object({
      ...sectionBase,
      image: imageField("Image"),
      cardText: fields.text({ label: "Card text" }),
    }),
    contactSection: fields.object({
      ...sectionBase,
      title: fields.text({
        label: "Details title",
        defaultValue: "Contact details",
      }),
      formTitle: fields.text({
        label: "Form title",
        defaultValue: "Send us a message",
      }),
      formSuccessTitle: fields.text({
        label: "Success title",
        defaultValue: "Message received",
      }),
      formSuccessText: fields.text({ label: "Success text" }),
      formNote: fields.text({ label: "Form note" }),
      callToAction: fields.object(
        {
          label: fields.text({ label: "Label" }),
          buttonLabel: fields.text({ label: "Button label" }),
          href: fields.text({ label: "Link" }),
        },
        { label: "Call to action row" },
      ),
    }),
    notFound: fields.object({
      ...sectionBase,
      backgroundImage: imageField("Background image"),
      backgroundPosition: fields.text({
        label: "Background position",
        defaultValue: "58% 55%",
      }),
      eyebrow: fields.text({
        label: "Eyebrow label",
        defaultValue: "Error 404",
      }),
      title: fields.text({ label: "Title" }),
      lead: fields.text({ label: "Lead paragraph" }),
      primaryButton: fields.object(buttonFields, { label: "Primary button" }),
      secondaryButton: fields.object(buttonFields, {
        label: "Secondary button",
      }),
      navLinks: fields.array(
        fields.object({
          label: fields.text({ label: "Label" }),
          href: fields.text({ label: "Href" }),
        }),
        { label: "Nav links", itemLabel: (props) => props.fields.label.value },
      ),
    }),
    serviceDetail: fields.object({
      ...sectionBase,
      service: fields.relationship({
        label: "Service",
        collection: "services",
      }),
    }),
  });

export default config({
  storage: {
    kind: "cloud",
  },
  cloud: {
    project: "mandrex/mandrex",
  },
  collections: {
    pages: collection({
      label: "Pages",
      path: "src/content/pages/*",
      slugField: "slug",
      schema: {
        title: fields.text({
          label: "Page title",
          validation: { isRequired: true },
        }),
        description: fields.text({
          label: "Meta description",
          validation: { isRequired: true },
        }),
        slug: fields.text({ label: "Slug", validation: { isRequired: true } }),
        sections: fields.array(createSectionConditional(true), {
          label: "Page sections",
          itemLabel: (props) => {
            const type = props.discriminant;
            if (type === "reusable") {
              return `Reusable: ${props.fields.section.value || "None"}`;
            }
            const labels: Record<string, string> = {
              hero: "Hero",
              innerHero: "Inner Hero",
              statsBar: "Stats bar",
              serviceGrid: "Service grid",
              whyChooseUs: "Why choose us",
              industriesGrid: "Industries grid",
              globalReach: "Global reach",
              testimonialFeature: "Testimonial feature",
              ctaBand: "CTA band",
              aboutStats: "About stats",
              founder: "Founder",
              visionMission: "Vision / Mission",
              team: "Team",
              howWeWork: "How we work",
              serviceCards: "Service cards",
              engagementSteps: "Engagement steps",
              featuredTestimonial: "Featured testimonial",
              testimonialsGrid: "Testimonials grid",
              closingBand: "Closing band",
              contactSection: "Contact section",
              notFound: "Not found",
              serviceDetail: "Service detail",
            };
            return labels[type] || type;
          },
        }),
      },
    }),
    reusableSections: collection({
      label: "Reusable Sections",
      path: "src/content/reusable-sections/*",
      slugField: "name",
      schema: {
        name: fields.text({
          label: "Section name",
          validation: { isRequired: true },
        }),
        section: createSectionConditional(false),
      },
    }),
    services: collection({
      label: "Services",
      path: "src/content/services/*",
      slugField: "key",
      // this list is always sorted by slug; "index" is what actually controls
      // the sequence on the site, so surface it here
      columns: ["name", "index"],
      schema: {
        key: fields.text({ label: "Key", validation: { isRequired: true } }),
        name: fields.text({ label: "Name", validation: { isRequired: true } }),
        short: fields.text({ label: "Short description" }),
        cardTitle: fields.text({ label: "Card title" }),
        cardDesc: fields.text({ label: "Card description" }),
        icon: iconField("Icon", "briefcase"),
        heroEyebrow: fields.text({ label: "Hero eyebrow" }),
        heroImage: imageField("Hero image"),
        heroAlt: fields.text({ label: "Hero image alt" }),
        heroObjectPosition: fields.text({
          label: "Hero object position",
          defaultValue: "50% 50%",
        }),
        h1: fields.text({ label: "H1 headline" }),
        lead: fields.text({ label: "Lead paragraph" }),
        ctaHeading: fields.text({ label: "CTA heading" }),
        accent: fields.select({
          label: "Accent color",
          options: [
            { label: "Green", value: "green" },
            { label: "Yellow", value: "yellow" },
            { label: "Red", value: "red" },
            { label: "Deep red", value: "deep-red" },
          ],
          defaultValue: "green",
        }),
        topBarColor: fields.text({
          label: "Top bar color",
          defaultValue: "#306A42",
        }),
        index: fields.text({
          label: "Index number",
          description:
            "Shown on the service card and used to order services on the site.",
        }),
        chips: fields.array(fields.text({ label: "Chip" }), {
          label: "Chips",
          itemLabel: (props) => props.value,
        }),
        facts: fields.array(
          fields.object({
            label: fields.text({ label: "Label" }),
            value: fields.text({ label: "Value" }),
          }),
          { label: "Facts", itemLabel: (props) => props.fields.label.value },
        ),
        scope: fields.array(
          fields.object({
            title: fields.text({ label: "Title" }),
            desc: fields.text({ label: "Description" }),
          }),
          {
            label: "Scope items",
            itemLabel: (props) => props.fields.title.value,
          },
        ),
        forWhom: fields.array(fields.text({ label: "Audience" }), {
          label: "Who it's for",
          itemLabel: (props) => props.value,
        }),
        tools: fields.array(fields.text({ label: "Tool" }), {
          label: "Tools",
          itemLabel: (props) => props.value,
        }),
        pullQuote: fields.text({ label: "Pull quote" }),
        homeImage: imageField("Home card image"),
      },
    }),
    testimonials: collection({
      label: "Testimonials",
      path: "src/content/testimonials/*",
      slugField: "slug",
      schema: {
        service: fields.text({
          label: "Service",
          validation: { isRequired: true },
        }),
        slug: fields.text({ label: "Slug", validation: { isRequired: true } }),
        quote: fields.text({
          label: "Quote",
          validation: { isRequired: true },
        }),
        role: fields.text({ label: "Role" }),
        detail: fields.text({ label: "Detail" }),
      },
    }),
    industries: collection({
      label: "Industries",
      path: "src/content/industries/*",
      slugField: "slug",
      schema: {
        name: fields.text({ label: "Name", validation: { isRequired: true } }),
        slug: fields.text({ label: "Slug", validation: { isRequired: true } }),
        desc: fields.text({
          label: "Description",
          validation: { isRequired: true },
        }),
        icon: iconField("Icon"),
      },
    }),
  },
  singletons: {
    site: singleton({
      label: "Site Settings",
      path: "src/content/site",
      schema: {
        nav: fields.object({
          pages: fields.array(
            fields.object({
              label: fields.text({ label: "Label" }),
              href: fields.text({ label: "Href" }),
            }),
            {
              label: "Nav pages",
              itemLabel: (props) => props.fields.label.value,
            },
          ),
          cta: fields.object(
            {
              label: fields.text({ label: "Label" }),
              href: fields.text({ label: "Href" }),
            },
            { label: "Nav CTA" },
          ),
        }),
        footer: fields.object({
          brandText: fields.text({ label: "Brand text" }),
          pages: fields.array(
            fields.object({
              label: fields.text({ label: "Label" }),
              href: fields.text({ label: "Href" }),
            }),
            {
              label: "Footer pages",
              itemLabel: (props) => props.fields.label.value,
            },
          ),
          copyright: fields.text({ label: "Copyright" }),
          domain: fields.text({ label: "Domain" }),
        }),
        contact: fields.object({
          email: fields.text({ label: "Email" }),
          phone1: fields.text({ label: "Phone 1" }),
          phone1Href: fields.text({ label: "Phone 1 href" }),
          phone2: fields.text({ label: "Phone 2" }),
          phone2Href: fields.text({ label: "Phone 2 href" }),
        }),
        socials: fields.array(
          fields.object({
            label: fields.text({ label: "Label" }),
            href: fields.text({ label: "Href" }),
          }),
          {
            label: "Social links",
            itemLabel: (props) => props.fields.label.value,
          },
        ),
        // The Industries list is a collection, so it is always shown sorted by
        // slug and cannot be dragged. This array is what actually sets the
        // order on the site — arrays are drag-reorderable.
        sectorOrder: fields.array(
          fields.relationship({ label: "Sector", collection: "industries" }),
          {
            label: "Sector order",
            description:
              "Drag to reorder the sectors on the home page. Any sector missing from this list appears at the end.",
            itemLabel: (props) => props.value || "Sector",
          },
        ),
      },
    }),
  },
});
