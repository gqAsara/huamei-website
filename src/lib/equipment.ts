export type Equipment = {
  row: number;
  model: string;
  brand: string | null;
  serial: string;
  year: string;
  image: string;
};

const pad = (n: number) => String(n).padStart(2, "0");
const img = (row: number) => `/photos/equipment/row_${pad(row)}.jpg`;

export const EQUIPMENT: Equipment[] = [
  { row: 1,  model: "Computerized Paper Cutter",                       brand: "Itoh (Japan)",            serial: "RC115",            year: "2002", image: img(1)  },
  { row: 2,  model: "Paper Cutter",                                    brand: "Shanghai",                serial: "QZYK1370",         year: "2011", image: img(2)  },
  { row: 3,  model: "8+1 Color Offset Printing Press",                 brand: "Manroland (Germany)",     serial: "B700-B1-446",      year: "2010", image: img(3)  },
  { row: 4,  model: "6+1 Color Offset Printing Press",                 brand: "Manroland (Germany)",     serial: "R706-3B",          year: "2003", image: img(4)  },
  { row: 5,  model: "6-Color Offset Printing Press",                   brand: "Koenig & Bauer (Germany)",serial: "RA105-6",          year: "2013", image: img(5)  },
  { row: 6,  model: "5-Color Offset Printing Press",                   brand: "Manroland (Germany)",     serial: "R705-3B",          year: "2004", image: img(6)  },
  { row: 7,  model: "Automatic Die Cutting Machine",                   brand: "Bobst",                   serial: "1050SE",           year: "2012", image: img(7)  },
  { row: 8,  model: "Automatic Die Cutting Machine",                   brand: "Bobst",                   serial: "SPEVOLINE 102E",   year: "2010", image: img(8)  },
  { row: 9,  model: "Automatic Die Cutting Machine",                   brand: "Yoheng (Tianjin)",        serial: "MKZD1020E",        year: "2020", image: img(9)  },
  { row: 10, model: "Automatic Die Cutting Machine",                   brand: "Yaoke",                   serial: "JY-105",           year: "2020", image: img(10) },
  { row: 11, model: "Automatic Screen Printing Machine",               brand: "Jinbao",                  serial: "JB-1050AG",        year: "2020", image: img(11) },
  { row: 12, model: "Automatic Screen Printing Machine",               brand: "Sakurai (Japan)",         serial: "MS-102A",          year: "2009", image: img(12) },
  { row: 13, model: "Automatic Mounting Machine (Carton Pasting)",     brand: "Dingshun (Taiwan)",       serial: "CS1207",           year: "2012", image: img(13) },
  { row: 14, model: "Automatic Mounting & Laminating Machine",         brand: "Dingshun (Taiwan)",       serial: "MF-1300S",         year: "2010", image: img(14) },
  { row: 15, model: "Hot Stamping Machine",                            brand: "Taiwan",                  serial: "TYMB1040",         year: "2004", image: img(15) },
  { row: 16, model: "Automatic Film Laminating Machine",               brand: "Wencheng (Taiwan)",       serial: "KYE-102DRK-800-M", year: "2006", image: img(16) },
  { row: 17, model: "Automatic Film Laminating Machine",               brand: "Kangdexin",               serial: "KMM-1050D",        year: "2015", image: img(17) },
  { row: 18, model: "Automatic Die-Cutting & Embossing Machine",       brand: "Yoheng (Tianjin)",        serial: "MK1050",           year: "2013", image: img(18) },
  { row: 19, model: "Automatic Creasing & Deep-Embossing Machine",     brand: "Wenhong (Tokyo)",         serial: "YW-1050SC",        year: "2012", image: img(19) },
  { row: 20, model: "Automatic Hot Stamping Machine",                  brand: "Yoheng (Tianjin)",        serial: "MK1060YM",         year: "2012", image: img(20) },
  { row: 21, model: "Automatic Folder Gluer",                          brand: "Taiyo (Japan)",           serial: "ASG1000M",         year: "2002", image: img(21) },
  { row: 22, model: "Automatic Folder Gluer",                          brand: "Taiyo (Japan)",           serial: "SO1300",           year: "2000", image: img(22) },
  { row: 23, model: "Automatic Folder Gluer",                          brand: "Wenhong",                 serial: "WH-1100W",         year: "2020", image: img(23) },
  { row: 24, model: "Manual Die Cutting Machine",                      brand: "Taiwan",                  serial: "PYQ108",           year: "2005", image: img(24) },
  { row: 25, model: "Manual Screen Printing Machine",                  brand: "Taiwan",                  serial: "JB-6090G",         year: "2010", image: img(25) },
  { row: 26, model: "Hardcover Production Line",                       brand: "Dongguan",                serial: "FL-650",           year: "2012", image: img(26) },
  { row: 27, model: "Precision Woodworking Saw",                       brand: "Taiwan",                  serial: "T1200C",           year: "2006", image: img(27) },
  { row: 28, model: "9-Axis V-Grooving Machine",                       brand: "Taiwan",                  serial: "MG-1410",          year: "2006", image: img(28) },
  { row: 29, model: "Rotary Scoring Machine",                          brand: "Saili",                   serial: "KLG950",           year: "2021", image: img(29) },
  { row: 30, model: "Automatic Bi-Directional Grooving Machine",       brand: "Saili",                   serial: "KLJ600",           year: "2017", image: img(30) },
  { row: 31, model: "Computer CTP System",                             brand: "Kodak (Shanghai)",        serial: "TT2222",           year: "2013", image: img(31) },
  { row: 32, model: "Automatic Rigid Box Making Machine",              brand: "Dongguan",                serial: "HM-600",           year: "2015", image: img(32) },
  { row: 33, model: "Automatic Covering Machine",                      brand: "Keqiang",                 serial: "ZPM-900A",         year: "2021", image: img(33) },
  { row: 34, model: "Automatic Case-Making Machine",                   brand: "Shentu",                  serial: "STO360",           year: "2021", image: img(34) },
  { row: 35, model: "Automatic Case-Making Machine",                   brand: "Jianlong",                serial: "JK-850",           year: "2021", image: img(35) },
  { row: 36, model: "Dry Laminating Machine",                          brand: null,                      serial: "BFY1200",          year: "2010", image: img(36) },
  { row: 37, model: "Automatic Book-Style Box Assembling Machine",     brand: "Yuanyi",                  serial: "H-9045A",          year: "2021", image: img(37) },
  { row: 38, model: "Automatic Liquor Box Machine",                    brand: "Jingang",                 serial: "ZH-320",           year: "2020", image: img(38) },
  { row: 39, model: "Automatic Liquor Box Machine",                    brand: "Guorun",                  serial: "GD-A510",          year: "2017", image: img(39) },
  { row: 40, model: "Automatic Liquor Box Machine",                    brand: "Lishunyuan",              serial: "LY-HB1500CJ",      year: "2021", image: img(40) },
  { row: 41, model: "Automatic Liquor Box Machine",                    brand: null,                      serial: "GDA510",           year: "2021", image: img(41) },
  { row: 42, model: "Blister Lid Assembly Machine",                    brand: "Jingang",                 serial: "SC-300",           year: "2021", image: img(42) },
  { row: 43, model: "Semi-Automatic Pasting Machine",                  brand: null,                      serial: "18",               year: "2021", image: img(43) },
];
