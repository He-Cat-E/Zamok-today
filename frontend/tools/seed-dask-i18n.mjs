/**
 * Merges insurance.dask.* keys into en.json and tr.json.
 * Run from frontend: node tools/seed-dask-i18n.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const localesDir = path.join(root, "public", "locales");

const COMMON_EN = {
  "insurance.common.docPdfBadge": "PDF"
};

const COMMON_TR = {
  "insurance.common.docPdfBadge": "PDF"
};

const EN = {
  "insurance.dask.breadcrumbCurrent": "DASK (Compulsory Earthquake Insurance)",
  "insurance.dask.heroTitle": "DASK (Compulsory Earthquake Insurance)",
  "insurance.dask.heroSubtitle": "Mandatory, reliable protection for your home against earthquakes and quake-related damage.",
  "insurance.dask.introP1":
    "DASK (compulsory earthquake insurance) is the legal product in Türkiye that secures residential buildings against earthquake and earthquake-related losses. It is required for homeowners and is requested for title work, electricity and water subscriptions, and many other formalities.",
  "insurance.dask.introP2":
    "As İlsa Insurance we arrange your DASK policy quickly at competitive prices and help you keep your property continuously protected.",
  "insurance.dask.ctaPrimary": "Get a quote",
  "insurance.dask.ctaSecondary": "Talk to an advisor",
  "insurance.dask.mockDisclaimer": "Illustrative page — contact İlsa Insurance for binding quotes and official DASK policy documents.",
  "insurance.dask.needTitle": "What you need to know about compulsory earthquake insurance (DASK)",
  "insurance.dask.needBody":
    "Under Türkiye’s disaster insurance legislation, privately owned residential premises and independent sections used as commercial premises or offices must have compulsory earthquake insurance (DASK). DASK covers damage caused directly or indirectly by earthquakes, including subsequent fire, explosion, tsunami, and landslide damage to insured buildings.",
  "insurance.dask.needListIntro": "DASK provides protection for fundamental building elements:",
  "insurance.dask.needList1": "Shared walls separating main and independent sections",
  "insurance.dask.needList2": "Garden and retaining walls",
  "insurance.dask.needList3": "Roofs, chimneys, staircases, corridors",
  "insurance.dask.needList4": "Elevators and other ancillary structures",
  "insurance.dask.needList5": "Main structural elements of the insured building as defined in the policy wording",
  "insurance.dask.needClosing":
    "You can start the policy process quickly with your DASK (UAVT) address code or by searching with your full address — our team at İlsa Insurance will guide you through the steps.",
  "insurance.dask.coverTitle": "What does DASK cover?",
  "insurance.dask.coverLead": "Compulsory earthquake insurance covers the following:",
  "insurance.dask.coverItem1": "Earthquake-related damage to the insured building",
  "insurance.dask.coverItem2": "Fire resulting from an earthquake",
  "insurance.dask.coverItem3": "Explosion linked to an earthquake event",
  "insurance.dask.coverItem4": "Landslide linked to an earthquake event",
  "insurance.dask.coverItem5": "Damage to the building’s load-bearing system caused by an earthquake",
  "insurance.dask.coverItem6": "Other covered perils stated in the information form and general terms",
  "insurance.dask.coverFootnote":
    "Cover applies to the structure itself. For household contents we recommend arranging separate home insurance with the extensions you need.",
  "insurance.dask.diffTitle": "The difference between DASK and home insurance",
  "insurance.dask.diffP1": "DASK only covers earthquake and earthquake-related damage to the insured building.",
  "insurance.dask.diffP2":
    "Home insurance can also cover fire, flood, theft, and many other risks, including contents. For the most comprehensive protection, both policies are usually recommended together.",
  "insurance.dask.compareTitle": "Guarantees at a glance",
  "insurance.dask.compareLead":
    "Protect your building against earthquake damage and related disasters such as fire, explosion, tsunami, and landslide with compulsory earthquake insurance (DASK). Combine with home insurance when you need contents and wider perils.",
  "insurance.dask.compareColGuarantee": "Coverage",
  "insurance.dask.compareColDask": "DASK (compulsory)",
  "insurance.dask.compareColHome": "Home insurance",
  "insurance.dask.compareRow1Label": "Earthquake and earthquake-related structural damage (as defined in the policy)",
  "insurance.dask.compareRow2Label": "Household contents and wider non-earthquake perils",
  "insurance.dask.compareCovered": "Covered",
  "insurance.dask.compareNotCovered": "Not covered",
  "insurance.dask.compareFootnote": "Illustrative comparison — exact guarantees depend on your DASK schedule and the home policy you choose.",
  "insurance.dask.pricingTitle": "How are DASK premiums determined?",
  "insurance.dask.pricingIntro": "Premiums are calculated using criteria such as:",
  "insurance.dask.pricingBullet1": "City or district where the property is located (for example Ankara)",
  "insurance.dask.pricingBullet2": "Construction type (reinforced concrete, masonry, etc.)",
  "insurance.dask.pricingBullet3": "Gross floor area (square metres)",
  "insurance.dask.pricingBullet4": "Age of the building",
  "insurance.dask.calcBody":
    "Across insurers the same DASK tariff principles apply. The insured location is identified with the UAVT address code, and the earthquake risk zone of that address is one of the main price drivers together with construction type and gross area.",
  "insurance.dask.calcClosing":
    "To obtain an indicative premium you need your property’s UAVT address code or the full address so the building can be matched to the correct risk band.",
  "insurance.dask.whyTitle": "Why İlsa Insurance?",
  "insurance.dask.why1": "Fast policy issuance and renewals",
  "insurance.dask.why2": "Competitive pricing from partner insurers",
  "insurance.dask.why3": "Ankara-based advisory",
  "insurance.dask.why4": "Renewal reminders so cover does not lapse",
  "insurance.dask.why5": "Support through claims and official procedures",
  "insurance.dask.expertLabel": "Our expert says",
  "insurance.dask.expertSlide1Quote":
    "Do not let DASK lapse at renewal — continuity matters for utilities and for uninterrupted structural protection after an earthquake.",
  "insurance.dask.expertSlide1Name": "Mehmet Yılmaz",
  "insurance.dask.expertSlide1Role": "Property underwriting — İlsa Insurance",
  "insurance.dask.expertSlide2Quote":
    "Match UAVT data carefully to the actual building; premium and eligibility follow the declared construction class and floor area.",
  "insurance.dask.expertSlide2Name": "Ayşe Demir",
  "insurance.dask.expertSlide2Role": "Customer advisory — İlsa Insurance",
  "insurance.dask.expertSlide3Quote":
    "Pair DASK with home insurance when you need contents, glass, and liability — the two products answer different questions.",
  "insurance.dask.expertSlide3Name": "Can Öztürk",
  "insurance.dask.expertSlide3Role": "Renewals specialist — İlsa Insurance",
  "insurance.dask.faqSectionTitle": "Frequently asked questions",
  "insurance.dask.faqSectionLead":
    "Answers below summarise typical DASK arrangements in Türkiye — your binding wording and tariff notices always prevail. For tailored advice, contact İlsa Insurance.",
  "insurance.dask.faqAllQuestions": "All questions",
  "insurance.dask.faqSeeMore": "See more questions",
  "insurance.dask.faqSeeLess": "Show fewer questions",
  "insurance.dask.faq1Q": "What is compulsory earthquake insurance (DASK)?",
  "insurance.dask.faq1A":
    "DASK is the mandatory earthquake product for eligible residential buildings in Türkiye. It indemnifies structural damage from earthquakes and certain follow-on events such as fire, explosion, tsunami, and landslide, within the limits and exclusions of the pool rules.",
  "insurance.dask.faq2Q": "Is DASK mandatory?",
  "insurance.dask.faq2A":
    "Yes — for eligible properties, maintaining valid DASK is a legal requirement and a valid policy is commonly requested when opening or transferring electricity, water, and natural gas subscriptions, and for many property-related formalities.",
  "insurance.dask.faq3Q": "What situations does DASK cover?",
  "insurance.dask.faq3A":
    "DASK responds to earthquake damage to the insured building and to damage from fire, explosion, tsunami, or landslide where these arise from an earthquake event. Movable contents are not covered — arrange home contents cover separately if needed.",
  "insurance.dask.faq4Q": "How much coverage does DASK provide?",
  "insurance.dask.faq4A":
    "The insured limit is set according to the tariff and the declared characteristics of the building; it is updated periodically. For the current limit that applies to your address, confirm on the official tariff information or ask İlsa Insurance when you request a quote.",
  "insurance.dask.faq5Q": "How are DASK prices determined?",
  "insurance.dask.faq5A":
    "Premiums follow the national tariff and depend mainly on earthquake risk zone, construction type, gross area, building age, and the declared address via UAVT. İlsa Insurance compares partner channels so you see a clear premium indication for your property.",
  "insurance.dask.faq6Q": "How often must DASK be renewed?",
  "insurance.dask.faq6A":
    "DASK is issued for a one-year term and should be renewed before expiry to avoid a gap in mandatory cover and to keep utility and administrative processes straightforward.",
  "insurance.dask.faq7Q": "Can I open electricity or water without DASK?",
  "insurance.dask.faq7A":
    "No — new electricity, water, or natural gas subscriptions for eligible premises generally require a valid DASK policy. Keep renewal dates in your calendar or ask İlsa Insurance for a reminder service.",
  "insurance.dask.faq8Q": "Who must hold DASK?",
  "insurance.dask.faq8A":
    "Owners of eligible residential buildings with title deed records must arrange DASK. Buyers, mortgage borrowers, and landlords in scope of the rules should also ensure continuous valid cover for the insured building.",
  "insurance.dask.docsTitle": "Compulsory earthquake insurance — related documents",
  "insurance.dask.docsLead": "You can view product information forms and key documents here.",
  "insurance.dask.doc1Title": "General terms and conditions of compulsory earthquake insurance",
  "insurance.dask.doc2Title": "Compulsory earthquake insurance — policy information form",
  "insurance.dask.docDownload": "Download",
  "insurance.dask.bottomCtaTitle": "Need a DASK policy or renewal?",
  "insurance.dask.bottomCtaBody": "Contact İlsa Insurance for a fast quotation and help with UAVT address details.",
  "insurance.dask.bottomCtaButton": "Contact us"
};

const TR = {
  "insurance.dask.breadcrumbCurrent": "DASK (Zorunlu Deprem Sigortası)",
  "insurance.dask.heroTitle": "DASK (Zorunlu Deprem Sigortası)",
  "insurance.dask.heroSubtitle": "Depreme karşı zorunlu ve güvenilir koruma",
  "insurance.dask.introP1":
    "DASK, yani Zorunlu Deprem Sigortası, deprem ve deprem kaynaklı hasarlara karşı konutunuzu güvence altına alan yasal bir sigortadır. Türkiye’de konut sahipleri için zorunludur; tapu işlemleri, elektrik–su abonelikleri ve birçok resmi işlemde geçerli poliçe istenir.",
  "insurance.dask.introP2":
    "İlsa Sigorta olarak DASK poliçenizi hızlı ve uygun fiyatlarla düzenliyor, konutunuzu kesintisiz şekilde güvence altında tutmanıza yardımcı oluyoruz.",
  "insurance.dask.ctaPrimary": "Teklif alın",
  "insurance.dask.ctaSecondary": "Danışmanla görüşün",
  "insurance.dask.mockDisclaimer": "Örnek bilgilendirme sayfası — bağlayıcı teklif ve resmi DASK belgeleri için İlsa Sigorta ile iletişime geçin.",
  "insurance.dask.needTitle": "Zorunlu deprem sigortası (DASK) hakkında bilmeniz gerekenler",
  "insurance.dask.needBody":
    "Afet Sigortaları Kanunu kapsamında, mülkiyeti size ait konutlar ile ticari veya büro amaçlı kullanılan bağımsız bölümlerde Zorunlu Deprem Sigortası (DASK) yaptırılması zorunludur. DASK; depremden doğrudan veya dolaylı olarak oluşan hasarları, deprem sonrası yangın, patlama, tsunami ve yer kayması gibi risklere bağlı bina hasarlarını poliçe şartları çerçevesinde teminat altına alır.",
  "insurance.dask.needListIntro": "DASK temelde aşağıdaki yapı unsurları için koruma sağlar:",
  "insurance.dask.needList1": "Ana bağımsız bölümleri ayıran ortak duvarlar",
  "insurance.dask.needList2": "Bahçe ve istinat duvarları",
  "insurance.dask.needList3": "Çatılar, bacalar, merdivenler, koridorlar",
  "insurance.dask.needList4": "Asansörler ve diğer yardımcı yapılar",
  "insurance.dask.needList5": "Poliçede tanımlanan taşıyıcı sistem ve ana yapı elemanları",
  "insurance.dask.needClosing":
    "Poliçe sürecine DASK adres kodunuz (UAVT) veya tam adres bilginizle hızlıca başlayabilirsiniz — İlsa Sigorta ekibi adımlarda size rehberlik eder.",
  "insurance.dask.coverTitle": "DASK neleri kapsar?",
  "insurance.dask.coverLead": "Zorunlu deprem sigortası aşağıdaki durumları teminat altına alır:",
  "insurance.dask.coverItem1": "Deprem kaynaklı bina hasarları",
  "insurance.dask.coverItem2": "Deprem sonucu oluşan yangın",
  "insurance.dask.coverItem3": "Depremle ilişkili patlama",
  "insurance.dask.coverItem4": "Depremle ilişkili yer kayması",
  "insurance.dask.coverItem5": "Binanın taşıyıcı sisteminde meydana gelen deprem hasarları",
  "insurance.dask.coverItem6": "Bilgilendirme formu ve genel şartlarda yer alan diğer teminatlar",
  "insurance.dask.coverFootnote":
    "Teminat esas olarak yapının kendisini kapsar. Eşyalar için ayrıca konut sigortası yaptırmanız önerilir.",
  "insurance.dask.diffTitle": "DASK ile konut sigortası arasındaki fark",
  "insurance.dask.diffP1": "DASK yalnızca deprem ve deprem kaynaklı hasarları kapsar.",
  "insurance.dask.diffP2":
    "Konut sigortası ise yangın, su baskını, hırsızlık ve diğer birçok riski de güvence altına alabilir. En kapsamlı koruma için genellikle her iki poliçe birlikte önerilir.",
  "insurance.dask.compareTitle": "Teminatlar — kısa özet",
  "insurance.dask.compareLead":
    "Zorunlu deprem sigortası (DASK) ile binanızı deprem ve deprem sonrası yangın, patlama, tsunami ve yer kayması gibi risklere karşı güvence altına alın. Eşya ve daha geniş riskler için konut sigortasını ekleyin.",
  "insurance.dask.compareColGuarantee": "Teminat kalemi",
  "insurance.dask.compareColDask": "DASK (zorunlu)",
  "insurance.dask.compareColHome": "Konut sigortası",
  "insurance.dask.compareRow1Label": "Deprem ve depremle ilişkili yapısal hasar (poliçede tanımlandığı şekilde)",
  "insurance.dask.compareRow2Label": "Konut eşyası ve deprem dışı pek çok risk",
  "insurance.dask.compareCovered": "Kapsamda",
  "insurance.dask.compareNotCovered": "Kapsam dışı",
  "insurance.dask.compareFootnote": "Özet tablodur — kesin teminatlar DASK poliçe tablonuz ve seçtiğiniz konut poliçesine göre değişir.",
  "insurance.dask.pricingTitle": "DASK fiyatları nasıl belirlenir?",
  "insurance.dask.pricingIntro": "Primler aşağıdaki gibi kriterlere göre belirlenir:",
  "insurance.dask.pricingBullet1": "Konutun bulunduğu il ve ilçe (örneğin Ankara)",
  "insurance.dask.pricingBullet2": "Yapı tipi (betonarme, yığma vb.)",
  "insurance.dask.pricingBullet3": "Brüt metrekare",
  "insurance.dask.pricingBullet4": "Binanın yaşı",
  "insurance.dask.calcBody":
    "Tüm sigorta şirketlerinde aynı DASK tarife ilkeleri uygulanır. Risk adresi UAVT kodu ile tanımlanır; adresin deprem risk bölgesi, yapı tipi ve metrekare başlıca fiyat unsurlarıdır.",
  "insurance.dask.calcClosing":
    "Hesaplama için konutunuzun DASK (UAVT) adres kodunu veya eksiksiz adres bilgisini bilmeniz yeterlidir — İlsa Sigorta doğru risk bandına eşleştirmede yardımcı olur.",
  "insurance.dask.whyTitle": "Neden İlsa Sigorta?",
  "insurance.dask.why1": "Hızlı poliçe düzenleme",
  "insurance.dask.why2": "Ortak şirketlerden uygun fiyat seçenekleri",
  "insurance.dask.why3": "Ankara merkezli danışmanlık",
  "insurance.dask.why4": "Poliçe yenileme hatırlatma hizmeti",
  "insurance.dask.why5": "Hasar ve resmi süreçlerde destek",
  "insurance.dask.expertLabel": "Uzmanımız diyor ki",
  "insurance.dask.expertSlide1Quote": "Yenileme tarihlerini kaçırmayın — kesintisiz DASK, abonelikler ve sürekli yapı güvencesi için kritiktir.",
  "insurance.dask.expertSlide1Name": "Mehmet Yılmaz",
  "insurance.dask.expertSlide1Role": "Mülk branşı — İlsa Sigorta",
  "insurance.dask.expertSlide2Quote": "UAVT ve yapı bilgilerini gerçek durumla tutarlı beyan edin; prim ve uygunluk buna bağlıdır.",
  "insurance.dask.expertSlide2Name": "Ayşe Demir",
  "insurance.dask.expertSlide2Role": "Müşteri danışmanlığı — İlsa Sigorta",
  "insurance.dask.expertSlide3Quote": "Eşya, cam ve sorumluluk için DASK’ı konut poliçesiyle tamamlayın — ürünler farklı ihtiyaçları karşılar.",
  "insurance.dask.expertSlide3Name": "Can Öztürk",
  "insurance.dask.expertSlide3Role": "Yenileme masası — İlsa Sigorta",
  "insurance.dask.faqSectionTitle": "Sıkça sorulan sorular",
  "insurance.dask.faqSectionLead":
    "Aşağıdaki yanıtlar tipik DASK düzenlemelerini özetler — bağlayıcı metin ve tarife bildirimleri daima önceliklidir. Kişiye özel danışmanlık için İlsa Sigorta ile iletişime geçin.",
  "insurance.dask.faqAllQuestions": "Tüm sorular",
  "insurance.dask.faqSeeMore": "Daha fazla soru",
  "insurance.dask.faqSeeLess": "Daha az göster",
  "insurance.dask.faq1Q": "Zorunlu deprem sigortası (DASK) nedir?",
  "insurance.dask.faq1A":
    "DASK, Türkiye’de uygun konut binaları için zorunlu deprem ürünüdür. Depremden kaynaklanan yapısal hasarları ve yangın, patlama, tsunami, yer kayması gibi depremle bağlantılı olayları, havuz kurallarındaki limit ve istisnalara tabi olarak teminat altına alır.",
  "insurance.dask.faq2Q": "DASK zorunlu mudur?",
  "insurance.dask.faq2A":
    "Evet — kapsamdaki taşınmazlar için geçerli DASK bulundurulması yasal zorunluluktur; elektrik, su ve doğalgaz abonelikleri ile birçok resmi işlemde geçerli poliçe talep edilir.",
  "insurance.dask.faq3Q": "DASK hangi durumları kapsar?",
  "insurance.dask.faq3A":
    "Sigortalı binada deprem hasarını ve deprem sonrası yangın, patlama, tsunami veya yer kaymasından doğan hasarları kapsar. Taşınır eşya teminatı DASK’ta yoktur — ihtiyaç halinde ayrıca konut eşyası teminatı alınmalıdır.",
  "insurance.dask.faq4Q": "DASK teminat tutarı neye göre belirlenir?",
  "insurance.dask.faq4A":
    "Sigorta bedeli tarifeye ve binanın beyan edilen özelliklerine göre belirlenir ve dönemsel olarak güncellenir. Adresinize uygulanan güncel limit için resmi tarife bilgisini kontrol edin veya teklif alırken İlsa Sigorta’dan netleştirin.",
  "insurance.dask.faq5Q": "DASK primleri nasıl hesaplanır?",
  "insurance.dask.faq5A":
    "Primler ulusal tarifeye göre; başlıca deprem risk bölgesi, yapı tipi, brüt alan, bina yaşı ve UAVT ile tanımlanan adrese göre belirlenir. İlsa Sigorta, ortak kanallardan net prim göstergesi sunmanıza yardımcı olur.",
  "insurance.dask.faq6Q": "DASK ne sıklıkla yenilenmelidir?",
  "insurance.dask.faq6A":
    "DASK genellikle bir yıllık süreyle düzenlenir ve zorunlu korumanın kesintiye uğramaması için vadesinden önce yenilenmelidir.",
  "insurance.dask.faq7Q": "DASK olmadan elektrik veya su aboneliği açılabilir mi?",
  "insurance.dask.faq7A":
    "Hayır — kapsamdaki bağımsız bölümlerde yeni elektrik, su veya doğalgaz abonelikleri için geçerli DASK poliçesi gerekir. Yenileme tarihlerini takvimleyin veya İlsa Sigorta’dan hatırlatma isteyin.",
  "insurance.dask.faq8Q": "DASK’ı kimler yaptırmalıdır?",
  "insurance.dask.faq8A":
    "Tapuda kayıtlı ve kapsamdaki mesken niteliğindeki binaların malikleri DASK yaptırmakla yükümlüdür. Alıcılar, konut kredisi kullananlar ve kural kapsamındaki kiraya verenler de sürekliliği sağlamalıdır.",
  "insurance.dask.docsTitle": "Zorunlu deprem sigortası — ilgili belgeler",
  "insurance.dask.docsLead": "Ürün bilgilendirme formu ve önemli belgelere buradan hızlıca ulaşabilirsiniz.",
  "insurance.dask.doc1Title": "Zorunlu deprem sigortası genel şartları",
  "insurance.dask.doc2Title": "Zorunlu deprem sigortası poliçe bilgilendirme formu",
  "insurance.dask.docDownload": "İndir",
  "insurance.dask.bottomCtaTitle": "DASK poliçesi veya yenileme mi gerekiyor?",
  "insurance.dask.bottomCtaBody": "Hızlı teklif ve UAVT adres detayları için İlsa Sigorta ile iletişime geçin.",
  "insurance.dask.bottomCtaButton": "İletişime geç"
};

function merge(pathName, patch) {
  const filePath = path.join(localesDir, pathName);
  const loc = JSON.parse(fs.readFileSync(filePath, "utf8"));
  for (const k of Object.keys(loc)) {
    if (k.startsWith("insurance.dask.") || k.startsWith("insurance.common.")) delete loc[k];
  }
  Object.assign(loc, patch);
  fs.writeFileSync(filePath, JSON.stringify(loc, null, 2) + "\n");
  console.log("wrote", pathName);
}

merge("en.json", { ...COMMON_EN, ...EN });
merge("tr.json", { ...COMMON_TR, ...TR });
console.log("Done.");
