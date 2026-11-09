/* ============================================================
   SpearArms — site configuration
   ------------------------------------------------------------
   EDIT EVERYTHING IN THIS FILE to personalize the site.
   No markup changes needed for business details, fees,
   or state waiting periods.
   ============================================================ */

window.SPEARARMS = {

  /* ---------- Business identity ---------- */
  business: {
    name: "SpearArms",
    fflNumber: "07-XX-XXXXX",          // TODO: replace with real FFL number
    sotNumber: "Class 3 SOT",          // TODO: replace with real SOT number if applicable
    addressLines: ["SpearArms — [Street Address]", "[City, State ZIP]"],
    phoneDisplay: "(555) 555-0100",
    phoneTel: "+15555550100",          // tel: link target, digits only with +
    email: "info@speararms.example",  // TODO: replace with real email
    hours: "Mon–Fri 10am–6pm · Sat by appointment",
    verifyUrl: "https://fflezcheck.atf.gov"
  },

  /* ---------- Transfer fee schedule (dollars) ----------
     These power the estimator and the printed transfer form.
     Adjust to your actual pricing. */
  fees: {
    transferBase: 35,        // flat inbound/outbound transfer fee
    nicsFee: 0,              // fee passed through for the background check (often $0–25)
    handlingNew: 0,          // extra for new-in-box items
    handlingUsed: 15,        // extra for used firearms (inspect/clean)
    cerakote: 150,           // starting price for Cerakote work
    sight: 75,               // sight / optic installation
    cleaning: 60,            // deep clean & inspect
    expedited: 50            // priority handling surcharge
  },

  /* ---------- NFA / tax-stamp guidance (display only) ---------- */
  nfa: {
    taxStamp: 200,           // current ATF NFA tax for Form 4 transfers
    typicalWeeksMin: 2,      // rough eForms turnaround range — update periodically
    typicalWeeksMax: 12
  },

  /* ---------- State waiting periods (days) ----------
     Maps state abbreviations to the *maximum state-mandated*
     waiting period in days for HANDGUNS and LONG GUNS.
     0 = no state-mandated waiting period.
     IMPORTANT: verify against current state law and update —
     laws change. Values below are starting points only. */
  stateWaitDays: {
    AL: { handgun: 0,   longgun: 0 },
    AK: { handgun: 0,   longgun: 0 },
    AZ: { handgun: 0,   longgun: 0 },
    AR: { handgun: 0,   longgun: 0 },
    CA: { handgun: 10,  longgun: 10 },  // CA: 10-day wait, handguns & centerfire semi-auto rifles
    CO: { handgun: 0,   longgun: 0 },
    CT: { handgun: 14,  longgun: 14 },  // CT: 14-day wait for handguns & certain long guns
    DE: { handgun: 0,   longgun: 0 },
    DC: { handgun: 10,  longgun: 10 },
    FL: { handgun: 3,   longgun: 0 },   // FL: 3-day handgun wait (with exceptions)
    GA: { handgun: 0,   longgun: 0 },
    HI: { handgun: 0,   longgun: 0 },
    ID: { handgun: 0,   longgun: 0 },
    IL: { handgun: 24,  longgun: 72 },  // IL: 24h handgun, 72h long gun from FFL receipt
    IN: { handgun: 0,   longgun: 0 },
    IA: { handgun: 0,   longgun: 0 },
    KS: { handgun: 0,   longgun: 0 },
    KY: { handgun: 0,   longgun: 0 },
    LA: { handgun: 0,   longgun: 0 },
    ME: { handgun: 0,   longgun: 0 },   // ME: 3-day handgun wait in some cases — verify
    MD: { handgun: 7,   longgun: 7 },   // MD: 7-day wait
    MA: { handgun: 7,   longgun: 7 },   // MA: 7-day wait
    MI: { handgun: 0,   longgun: 0 },
    MN: { handgun: 0,   longgun: 0 },
    MS: { handgun: 0,   longgun: 0 },
    MO: { handgun: 0,   longgun: 0 },   // MO: 7-day wait was enjoined — verify current status
    MT: { handgun: 0,   longgun: 0 },
    NE: { handgun: 0,   longgun: 0 },
    NV: { handgun: 0,   longgun: 0 },
    NH: { handgun: 0,   longgun: 0 },
    NJ: { handgun: 0,   longgun: 0 },
    NM: { handgun: 0,   longgun: 0 },
    NY: { handgun: 0,   longgun: 0 },   // NY: no general wait; NYC has rules — verify
    NC: { handgun: 0,   longgun: 0 },
    ND: { handgun: 0,   longgun: 0 },
    OH: { handgun: 0,   longgun: 0 },   // OH: no general wait; some cities differ — verify
    OK: { handgun: 0,   longgun: 0 },
    OR: { handgun: 0,   longgun: 0 },
    PA: { handgun: 0,   longgun: 0 },
    RI: { handgun: 0,   longgun: 0 },
    SC: { handgun: 0,   longgun: 0 },
    SD: { handgun: 0,   longgun: 0 },
    TN: { handgun: 0,   longgun: 0 },
    TX: { handgun: 0,   longgun: 0 },
    UT: { handgun: 0,   longgun: 0 },
    VT: { handgun: 0,   longgun: 0 },
    VA: { handgun: 0,   longgun: 0 },   // VA: no general wait; some local rules — verify
    WA: { handgun: 0,   longgun: 0 },   // WA: 10-day wait only for certain semi-auto rifles — verify
    WV: { handgun: 0,   longgun: 0 },
    WI: { handgun: 0,   longgun: 0 },
    WY: { handgun: 0,   longgun: 0 }
  },

  /* ---------- US states for the estimator dropdown ---------- */
  states: [
    ["AL","Alabama"],["AK","Alaska"],["AZ","Arizona"],["AR","Arkansas"],["CA","California"],
    ["CO","Colorado"],["CT","Connecticut"],["DE","Delaware"],["DC","District of Columbia"],
    ["FL","Florida"],["GA","Georgia"],["HI","Hawaii"],["ID","Idaho"],["IL","Illinois"],
    ["IN","Indiana"],["IA","Iowa"],["KS","Kansas"],["KY","Kentucky"],["LA","Louisiana"],
    ["ME","Maine"],["MD","Maryland"],["MA","Massachusetts"],["MI","Michigan"],["MN","Minnesota"],
    ["MS","Mississippi"],["MO","Missouri"],["MT","Montana"],["NE","Nebraska"],["NV","Nevada"],
    ["NH","New Hampshire"],["NJ","New Jersey"],["NM","New Mexico"],["NY","New York"],["NC","North Carolina"],
    ["ND","North Dakota"],["OH","Ohio"],["OK","Oklahoma"],["OR","Oregon"],["PA","Pennsylvania"],
    ["RI","Rhode Island"],["SC","South Carolina"],["SD","South Dakota"],["TN","Tennessee"],
    ["TX","Texas"],["UT","Utah"],["VT","Vermont"],["VA","Virginia"],["WA","Washington"],
    ["WV","West Virginia"],["WI","Wisconsin"],["WY","Wyoming"]
  ]
};
