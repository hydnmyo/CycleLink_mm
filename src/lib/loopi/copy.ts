export type LoopiLang = 'en' | 'my'

export type MaterialKind =
  | 'textile'
  | 'plastic'
  | 'paper'
  | 'metal'
  | 'wood'
  | 'rubber'
  | 'electronic'
  | 'other'

export const MATERIAL_KINDS: MaterialKind[] = [
  'textile',
  'plastic',
  'paper',
  'metal',
  'wood',
  'rubber',
  'electronic',
  'other',
]

const en: Record<string, string> = {
  subtitle: 'Your CycleLink Assistant',
  welcome:
    'Hi! I’m Loopi, your CycleLink assistant. How can I help you today?',
  openPet: 'Open Loopi assistant',
  closePanel: 'Close Loopi',
  refresh: 'Refresh conversation',
  refreshTitle: 'Start a new conversation?',
  refreshBody: 'This clears the current chat and returns to the welcome menu.',
  refreshConfirm: 'Start new chat',
  refreshCancel: 'Keep chatting',
  back: 'Back',
  langEn: 'English',
  langMy: 'မြန်မာ',
  language: 'Language',
  placeholder: 'Ask Loopi…',
  send: 'Send message',
  typing: 'Loopi is typing',
  findMaterials: 'Find Materials',
  createListing: 'Create a Listing',
  estimatePrice: 'Estimate Price',
  trackOrder: 'Track an Order',
  impact: 'Environmental Impact',
  howItWorks: 'How CycleLink Works',
  contactSupport: 'Contact Support',
  askCategory: 'Which material are you looking for?',
  textile: 'Fabric and Textile',
  plastic: 'Plastic',
  paper: 'Paper and Cardboard',
  metal: 'Metal',
  wood: 'Wood',
  rubber: 'Rubber',
  electronic: 'Electronic Components',
  other: 'Other',
  askLocation: 'Which location do you prefer?',
  anyLocation: 'Any location',
  askQuantity: 'How much do you need? You can type a quantity such as 500 kg or 2 tons.',
  skipQuantity: 'Any quantity',
  askBudget: 'What is your optional budget in MMK?',
  skipBudget: 'No budget limit',
  resultsIntro: 'Here are listings that match your filters. These are live marketplace records — not invented results.',
  noResults:
    'No matching information is currently available for those filters. You can change the category, location, quantity, or budget.',
  changeFilters: 'Change filters',
  viewListing: 'View Listing',
  listedAvailable: 'Listed · available for inquiry',
  noPhoto: 'No photo',
  seller: 'Seller',
  location: 'Location',
  qty: 'Quantity',
  price: 'Price',
  createGuide:
    'To list surplus, you will need a title, description, category, quantity, unit, condition, city, and an optional price in MMK. Sign in is required before posting.',
  openForm: 'Open Listing Form',
  estimateAskCategory: 'Which material should I estimate?',
  estimateAskCondition: 'What is the condition?',
  condNew: 'New',
  condUsed: 'Used',
  condScrap: 'Scrap',
  estimateAskQuantity: 'What quantity should I use for the estimate? Type a value such as 800 kg.',
  estimateAskLocation: 'Which city should I compare against?',
  estimateResult:
    'Estimate only, based on {count} priced listings for this material and location: about {price} per kg ({total} for {qty}).',
  estimateInsufficient: 'Not enough information to estimate a reliable price.',
  trackNeedLogin: 'Order tracking needs a signed-in CycleLink account. This platform does not store shipment orders yet.',
  trackNone:
    'There is no order data in your account. CycleLink currently records listing inquiries, not shipment orders, so there is nothing to track.',
  trackLogin: 'Log in',
  impactIntro:
    'These figures come from surplus currently listed for reuse on CycleLink — not from completed sales, and not invented statistics.',
  impactDiverted: 'Material listed (potential diversion from waste)',
  impactCo2: 'Estimated CO₂e avoided',
  impactSdgs: 'Relevant UN Sustainable Development Goals: SDG 8, SDG 9, SDG 11, SDG 12, SDG 13, and SDG 17.',
  impactOpen: 'Open Impact page',
  howSteps:
    '1. Businesses list surplus or recyclable materials.\n2. Buyers find useful materials.\n3. Buyer and seller confirm the transaction.\n4. Materials are reused instead of becoming waste.\n5. Both businesses and the environment benefit.',
  howOpen: 'Read How it works',
  supportText:
    'CycleLink does not publish a support phone number or email on this site. For listing questions, send an inquiry from a listing page. For how the marketplace works, use the guide below.',
  browse: 'Browse listings',
  offTopic:
    'I can help with CycleLink surplus materials, listings, recycling, impact, and support. What would you like to do on the marketplace?',
  parseQuantity:
    'I could not read that quantity. Try a number with a unit, such as 500 kg or 2 ton.',
  parseBudget: 'I could not read that budget. Enter an amount in MMK, or choose no budget limit.',
  parseGeneric: 'Please choose one of the options below, or ask about CycleLink listings and surplus materials.',
}

const my: Record<string, string> = {
  subtitle: 'သင်၏ CycleLink အကူအညီပေးသူ',
  welcome:
    'မင်္ဂလာပါ။ ကျွန်တော်က CycleLink ရဲ့ အကူအညီပေးသူ Loopi ပါ။ ဒီနေ့ ဘာကူညီပေးရမလဲ?',
  openPet: 'Loopi အကူအညီပေးသူကို ဖွင့်ရန်',
  closePanel: 'Loopi ကို ပိတ်ရန်',
  refresh: 'စကားပြောခန်းကို ပြန်စရန်',
  refreshTitle: 'စကားပြောခန်းအသစ် စတင်မလား?',
  refreshBody: 'လက်ရှိ စကားပြောခန်းကို ဖျက်ပြီး ကြိုဆိုမီနူးသို့ ပြန်သွားပါမည်။',
  refreshConfirm: 'အသစ်စတင်ရန်',
  refreshCancel: 'ဆက်လက်ပြောရန်',
  back: 'နောက်သို့',
  langEn: 'English',
  langMy: 'မြန်မာ',
  language: 'ဘာသာစကား',
  placeholder: 'Loopi ကို မေးရန်…',
  send: 'ပို့ရန်',
  typing: 'Loopi ရိုက်နေသည်',
  findMaterials: 'ပစ္စည်းရှာရန်',
  createListing: 'စာရင်းတင်ရန်',
  estimatePrice: 'ဈေးခန့်မှန်းရန်',
  trackOrder: 'အော်ဒါလိုက်ရန်',
  impact: 'ပတ်ဝန်းကျင်ထိခိုက်မှု',
  howItWorks: 'CycleLink အလုပ်လုပ်ပုံ',
  contactSupport: 'အကူအညီဆက်သွယ်ရန်',
  askCategory: 'ဘယ်ပစ္စည်းအမျိုးအစားကို ရှာနေပါသလဲ?',
  textile: 'အထည်နှင့် အထည်အလိပ်',
  plastic: 'ပလတ်စတစ်',
  paper: 'စက္ကူနှင့် ကတ်ထူ',
  metal: 'သတ္တု',
  wood: 'သစ်သား',
  rubber: 'ရော်ဘာ',
  electronic: 'အီလက်ထရွန်နစ် အစိတ်အပိုင်း',
  other: 'အခြား',
  askLocation: 'ဘယ်တည်နေရာကို ဦးစားပေးမလဲ?',
  anyLocation: 'တည်နေရာမရွေး',
  askQuantity: 'ဘယ်လောက်လိုပါသလဲ။ ဥပမာ ၅၀၀ kg သို့မဟုတ် ၂ ton လို ရိုက်ထည့်နိုင်ပါတယ်။',
  skipQuantity: 'ပမာဏမရွေး',
  askBudget: 'ဘတ်ဂျက်ကန့်သတ်ချက်ရှိရင် MMK ဖြင့် ရိုက်ထည့်ပါ။',
  skipBudget: 'ဘတ်ဂျက်မကန့်သတ်ပါ',
  resultsIntro:
    'သင့်စစ်ထုတ်ချက်နှင့် ကိုက်ညီသော စာရင်းများဖြစ်ပါတယ်။ ဒါတွေက ဈေးကွက်ထဲက အချက်အလက်အစစ်များသာ ဖြစ်ပြီး ဖန်တီးထားခြင်းမဟုတ်ပါ။',
  noResults:
    'ယခု စစ်ထုတ်ချက်များနှင့် ကိုက်ညီသော အချက်အလက် မရှိသေးပါ။ အမျိုးအစား၊ တည်နေရာ၊ ပမာဏ သို့မဟုတ် ဘတ်ဂျက်ကို ပြောင်းကြည့်နိုင်ပါတယ်။',
  changeFilters: 'စစ်ထုတ်ချက်ပြောင်းရန်',
  viewListing: 'စာရင်းကြည့်ရန်',
  listedAvailable: 'တင်ထားသည် · မေးမြန်းနိုင်သည်',
  noPhoto: 'ဓာတ်ပုံမရှိ',
  seller: 'ရောင်းသူ',
  location: 'တည်နေရာ',
  qty: 'ပမာဏ',
  price: 'ဈေး',
  createGuide:
    'ပိုလျှံပစ္စည်းတင်ရန် ခေါင်းစဉ်၊ ဖော်ပြချက်၊ အမျိုးအစား၊ ပမာဏ၊ ယူနစ်၊ အခြေအနေ၊ မြို့ နှင့် MMK ဈေး (ရှိလျှင်) လိုအပ်ပါတယ်။ တင်ရန် အကောင့်ဝင်ရပါမည်။',
  openForm: 'စာရင်းဖောင်ဖွင့်ရန်',
  estimateAskCategory: 'ဘယ်ပစ္စည်းအတွက် ဈေးခန့်မှန်းရမလဲ?',
  estimateAskCondition: 'ပစ္စည်းအခြေအနေက ဘာလဲ?',
  condNew: 'အသစ်',
  condUsed: 'သုံးပြီး',
  condScrap: 'အပိုင်းအစ',
  estimateAskQuantity: 'ခန့်မှန်းရန် ပမာဏကို ရိုက်ထည့်ပါ။ ဥပမာ ၈၀၀ kg။',
  estimateAskLocation: 'ဘယ်မြို့နှင့် နှိုင်းယှဉ်ရမလဲ?',
  estimateResult:
    'ခန့်မှန်းဈေးသာ ဖြစ်ပါသည်။ ဤပစ္စည်းနှင့် တည်နေရာအတွက် ဈေးပါသော စာရင်း {count} ခုအပေါ် မူတည်ပြီး တစ်ကီလိုလျှင် {price} ခန့် ({qty} အတွက် {total})။',
  estimateInsufficient: 'ယုံကြည်ရသော ဈေးခန့်မှန်းရန် အချက်အလက် မလုံလောက်ပါ။',
  trackNeedLogin:
    'အော်ဒါလိုက်ရန် CycleLink အကောင့်ဝင်ရန် လိုပါတယ်။ ဤပလက်ဖောင်းတွင် ပို့ဆောင်အော်ဒါ မှတ်တမ်း မထားသေးပါ။',
  trackNone:
    'သင့်အကောင့်တွင် အော်ဒါအချက်အလက် မရှိပါ။ CycleLink သည် လက်ရှိတွင် စာရင်းမေးမြန်းချက်များကိုသာ မှတ်ပြီး ပို့ဆောင်အော်ဒါ မမှတ်သောကြောင့် လိုက်ရန် အရာမရှိပါ။',
  trackLogin: 'အကောင့်ဝင်ရန်',
  impactIntro:
    'ဤကိန်းဂဏန်းများသည် CycleLink တွင် ပြန်လည်အသုံးပြုရန် တင်ထားသော ပိုလျှံပစ္စည်းများမှ ဖြစ်ပြီး ရောင်းချပြီး ငွေရှင်းချက်များမဟုတ်ပါ။ ဖန်တီးထားသော စာရင်းဇယားများ မဟုတ်ပါ။',
  impactDiverted: 'တင်ထားသော ပစ္စည်း (စွန့်ပစ်မှုမှ ကင်းလွတ်နိုင်ခြေ)',
  impactCo2: 'ခန့်မှန်း ရှောင်ရှားနိုင်သော CO₂e',
  impactSdgs: 'ဆက်စပ်သော ကုလသမဂ္ဂ စဉ်ဆက်မပြတ်ဖွံ့ဖြိုးမှု ရည်မှန်းချက်များ: SDG 8, SDG 9, SDG 11, SDG 12, SDG 13 နှင့် SDG 17။',
  impactOpen: 'ထိခိုက်မှုစာမျက်နှာဖွင့်ရန်',
  howSteps:
    '၁။ စီးပွားရေးလုပ်ငန်းများက ပိုလျှံ သို့မဟုတ် ပြန်လည်အသုံးပြုနိုင်သော ပစ္စည်းများကို တင်သည်။\n၂။ ဝယ်သူများက အသုံးဝင်သော ပစ္စည်းကို ရှာသည်။\n၃။ ဝယ်သူနှင့် ရောင်းသူက အရောင်းအဝယ်ကို အတည်ပြုသည်။\n၄။ ပစ္စည်းများကို စွန့်ပစ်မည့်အစား ပြန်လည်အသုံးပြုသည်။\n၅။ လုပ်ငန်းများနှင့် ပတ်ဝန်းကျင် နှစ်ခုလုံး အကျိုးရှိသည်။',
  howOpen: 'အလုပ်လုပ်ပုံ ဖတ်ရန်',
  supportText:
    'ဤဝက်ဘ်ဆိုက်တွင် အကူအညီဖုန်းနံပါတ် သို့မဟုတ် အီးမေးလ် မဖော်ပြထားပါ။ စာရင်းအကြောင်းမေးရန် စာရင်းစာမျက်နှာမှ မေးမြန်းနိုင်သည်။ ဈေးကွက်အလုပ်လုပ်ပုံကို အောက်ပါလမ်းညွှန်မှ ကြည့်နိုင်သည်။',
  browse: 'စာရင်းများကြည့်ရန်',
  offTopic:
    'CycleLink ပိုလျှံပစ္စည်း၊ စာရင်းများ၊ ပြန်လည်အသုံးပြုခြင်း၊ ထိခိုက်မှုနှင့် အကူအညီတို့ကိုသာ ကူညီပေးနိုင်ပါတယ်။ ဈေးကွက်ထဲမှာ ဘာကူညီပေးရမလဲ?',
  parseQuantity:
    'ပမာဏကို ဖတ်မရပါ။ ၅၀၀ kg သို့မဟုတ် ၂ ton ကဲ့သို့ ဂဏန်းနှင့် ယူနစ် ရိုက်ထည့်ပါ။',
  parseBudget: 'ဘတ်ဂျက်ကို ဖတ်မရပါ။ MMK ပမာဏ ရိုက်ထည့်ပါ၊ သို့မဟုတ် ကန့်သတ်မထားရန် ရွေးပါ။',
  parseGeneric: 'အောက်ပါ ရွေးချယ်မှုတစ်ခုကို နှိပ်ပါ၊ သို့မဟုတ် CycleLink စာရင်းများအကြောင်း မေးပါ။',
}

export function hasCopyKey(key: string): boolean {
  return key in en
}

export function t(lang: LoopiLang, key: string, params?: Record<string, string>): string {
  const table = lang === 'my' ? my : en
  let value = table[key] ?? en[key] ?? key
  if (params) {
    for (const [name, replacement] of Object.entries(params)) {
      value = value.replaceAll(`{${name}}`, replacement)
    }
  }
  return value
}

export const MAIN_ACTIONS = [
  'findMaterials',
  'createListing',
  'estimatePrice',
  'trackOrder',
  'impact',
  'howItWorks',
  'contactSupport',
] as const
