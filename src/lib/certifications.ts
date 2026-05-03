export type Certification = {
  id: string;
  name: string;
  body: string;
  scope: string;
  image: string;
};

const img = (n: string) => `/photos/certifications/${n}`;

export const CERTIFICATIONS: Certification[] = [
  { id: "fsc",                  name: "FSC Chain-of-Custody",     body: "Forest Stewardship Council", scope: "All paper & board",            image: img("fsc.jpg") },
  { id: "iso-9001",             name: "ISO 9001",                 body: "Quality management",         scope: "All sites",                    image: img("iso-9001.jpg") },
  { id: "iso-9001-2",           name: "ISO 9001",                 body: "Quality management",         scope: "Renewal",                      image: img("iso-9001-2.jpg") },
  { id: "iso-14001",            name: "ISO 14001",                body: "Environmental management",   scope: "All sites",                    image: img("iso-14001.jpg") },
  { id: "iso-14001-2",          name: "ISO 14001",                body: "Environmental management",   scope: "Renewal",                      image: img("iso-14001-2.jpg") },
  { id: "iso-45001",            name: "ISO 45001",                body: "Occupational health & safety", scope: "All sites",                  image: img("iso-45001.jpg") },
  { id: "iso-authorization",    name: "ISO Authorization",        body: "Certification body letter",  scope: "Authority of issue",           image: img("iso-authorization.png") },
  { id: "ce-paper-box",         name: "CE — Paper box",           body: "European Conformity",        scope: "Rigid box export",             image: img("ce-paper-box.png") },
  { id: "ce-paper-bag",         name: "CE — Paper bag",           body: "European Conformity",        scope: "Shopper export",               image: img("ce-paper-bag.png") },
  { id: "ce-authorization",     name: "CE Authorization",         body: "Notified body letter",       scope: "Authority of issue",           image: img("ce-authorization.png") },
  { id: "business-license",     name: "Business License",         body: "PRC State Administration",   scope: "Wuzhi Huamei",                 image: img("business-license.jpg") },
  { id: "printing-license",     name: "Printing License",         body: "PRC Press & Publication",    scope: "Authorized printer",           image: img("printing-license.jpg") },
  { id: "bank-account-license", name: "Bank Account License",     body: "People's Bank of China",     scope: "Wuzhi Huamei",                 image: img("bank-account-license.jpg") },
];
