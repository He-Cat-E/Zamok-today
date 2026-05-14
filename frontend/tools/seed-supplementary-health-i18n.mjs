/**
 * Merges insurance.supplementaryHealth.* into en.json and tr.json (and insurance.common.* into en only).
 * Run from frontend: node tools/seed-supplementary-health-i18n.mjs
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

const EN = {
  "insurance.supplementaryHealth.breadcrumbCurrent": "Supplementary Health Insurance (TSS)",
  "insurance.supplementaryHealth.heroTitle": "Supplementary Health Insurance (TSS)",
  "insurance.supplementaryHealth.heroSubtitle": "Extra health insurance for people already covered by SGK (Social Security Institution).",
  "insurance.supplementaryHealth.introP1":
    "Supplementary health insurance (TSS) is a type of insurance that allows you to receive healthcare services in private hospitals contracted with the Social Security Institution (SGK) without paying the usual fee differences on top of SGK tariffs. It offers faster, more comfortable access alongside state hospitals, within the limits of your chosen product.",
  "insurance.supplementaryHealth.introP2":
    "At İlsa Insurance we compare supplementary health insurance options to suit your budget and help you choose the most suitable policy from our partner insurers.",
  "insurance.supplementaryHealth.ctaPrimary": "Get a quote",
  "insurance.supplementaryHealth.ctaSecondary": "Talk to an advisor",
  "insurance.supplementaryHealth.mockDisclaimer": "Illustrative page — contact İlsa Insurance for binding quotes and policy wording.",
  "insurance.supplementaryHealth.coverTitle": "What does supplementary health insurance cover?",
  "insurance.supplementaryHealth.coverLead": "Depending on the chosen policy, it may include the following coverages:",
  "insurance.supplementaryHealth.coverItem1": "Inpatient treatment expenses",
  "insurance.supplementaryHealth.coverItem2": "Surgery and hospital expenses",
  "insurance.supplementaryHealth.coverItem3": "Outpatient treatment (doctor examination)",
  "insurance.supplementaryHealth.coverItem4": "Laboratory tests, diagnostics and imaging",
  "insurance.supplementaryHealth.coverItem5": "Physiotherapy services (where included)",
  "insurance.supplementaryHealth.coverItem6": "Maternity coverage (optional package, where offered)",
  "insurance.supplementaryHealth.coverFootnote": "Coverage scope may vary depending on the insurance company and the schedule you select.",
  "insurance.supplementaryHealth.whoTitle": "Who can benefit?",
  "insurance.supplementaryHealth.whoItem1": "Employees registered with SGK",
  "insurance.supplementaryHealth.whoItem2": "Retirees covered by SGK",
  "insurance.supplementaryHealth.whoItem3": "Individuals within eligible age bands (commonly up to age 65 — confirm on your quote)",
  "insurance.supplementaryHealth.whoItem4": "Households who want a family policy structure",
  "insurance.supplementaryHealth.whoItem5": "Anyone with valid SGK entitlements seeking coordinated private-hospital access",
  "insurance.supplementaryHealth.whoFootnote": "Eligibility, waiting periods, and underwriting rules are set by the insurer — İlsa Insurance checks the details with you before inception.",
  "insurance.supplementaryHealth.whyProductTitle": "Why supplementary health insurance?",
  "insurance.supplementaryHealth.whyProduct1": "You can reduce or eliminate extra fee differences at contracted private hospitals when SGK coordination applies.",
  "insurance.supplementaryHealth.whyProduct2": "Shorter appointment and admission journeys compared with relying on informal out-of-pocket arrangements alone.",
  "insurance.supplementaryHealth.whyProduct3": "More comfortable treatment settings where your product’s hospital list matches your preferences.",
  "insurance.supplementaryHealth.whyProduct4": "Competitive premiums when the benefit design is matched to how you actually use healthcare.",
  "insurance.supplementaryHealth.advSectionTitle": "Supplementary health insurance advantages",
  "insurance.supplementaryHealth.advLead": "Secure your health with the right supplementary plan — benefits depend on the package you bind.",
  "insurance.supplementaryHealth.adv1Title": "Check-up",
  "insurance.supplementaryHealth.adv1Body":
    "Comprehensive check-up benefits on selected programmes can include blood tests, chest X-ray, ECG, and cholesterol screening — see your information form for the exact menu.",
  "insurance.supplementaryHealth.adv2Title": "Lifetime renewal guarantee (where offered)",
  "insurance.supplementaryHealth.adv2Body":
    "Some products promote continuous renewal rights subject to insurer rules, continuous cover history, and good-faith disclosures — confirm eligibility wording on your offer.",
  "insurance.supplementaryHealth.adv3Title": "Maternity coverage",
  "insurance.supplementaryHealth.adv3Body":
    "Optional maternity modules can bundle delivery and antenatal benefits where the insurer includes them — always check sub-limits and waiting periods.",
  "insurance.supplementaryHealth.adv4Title": "Dental check-up",
  "insurance.supplementaryHealth.adv4Body":
    "Many plans include periodic dental check-up access through contracted clinic networks for insured persons from age 1, depending on package.",
  "insurance.supplementaryHealth.adv5Title": "Flexible plans and networks",
  "insurance.supplementaryHealth.adv5Body":
    "You can often choose between different hospital lists and outpatient visit packages so the policy reflects how you use healthcare.",
  "insurance.supplementaryHealth.adv6Title": "Children insured individually",
  "insurance.supplementaryHealth.adv6Body":
    "Depending on product rules, children under 18 can sometimes be insured on their own certificate — ask İlsa Insurance whether your chosen plan allows it.",
  "insurance.supplementaryHealth.whyTitle": "Why İlsa Insurance?",
  "insurance.supplementaryHealth.why1": "Multiple insurer offers compared side by side",
  "insurance.supplementaryHealth.why2": "Competitive pricing from our partner panel",
  "insurance.supplementaryHealth.why3": "Ankara-based consultancy",
  "insurance.supplementaryHealth.why4": "Fast policy issuance when you decide",
  "insurance.supplementaryHealth.why5": "Renewal reminders and ongoing policy support",
  "insurance.supplementaryHealth.expertLabel": "Our expert says",
  "insurance.supplementaryHealth.expertSlide1Quote":
    "Start with the hospital list you really use — supplementary value collapses if your preferred providers are not in-network for the tier you bought.",
  "insurance.supplementaryHealth.expertSlide1Name": "Mehmet Yılmaz",
  "insurance.supplementaryHealth.expertSlide1Role": "Health underwriting — İlsa Insurance",
  "insurance.supplementaryHealth.expertSlide2Quote":
    "Ask explicitly about outpatient visit counts, co-payments, and exclusions for chronic follow-up — these drive satisfaction more than brochure headlines.",
  "insurance.supplementaryHealth.expertSlide2Name": "Ayşe Demir",
  "insurance.supplementaryHealth.expertSlide2Role": "Customer advisory — İlsa Insurance",
  "insurance.supplementaryHealth.expertSlide3Quote":
    "If you travel often, do not assume SGK supplementary cover works abroad — pair domestic TSS with travel medical cover when needed.",
  "insurance.supplementaryHealth.expertSlide3Name": "Can Öztürk",
  "insurance.supplementaryHealth.expertSlide3Role": "Claims desk — İlsa Insurance",
  "insurance.supplementaryHealth.faqSectionTitle": "Frequently asked questions",
  "insurance.supplementaryHealth.faqSectionLead":
    "You can find answers to common questions about supplementary health insurance below. For binding answers about your own situation, contact İlsa Insurance.",
  "insurance.supplementaryHealth.faqAllQuestions": "All questions",
  "insurance.supplementaryHealth.faqSeeMore": "See more questions",
  "insurance.supplementaryHealth.faqSeeLess": "Show fewer questions",
  "insurance.supplementaryHealth.faq1Q": "What is supplementary health insurance?",
  "insurance.supplementaryHealth.faq1A":
    "Supplementary health insurance is a private health product that helps cover the difference in costs for healthcare expenses coordinated with the Social Security Institution (SGK) at contracted private hospitals, within the limits and exclusions of your policy — excluding any mandatory SGK co-payment rules that still apply by law.",
  "insurance.supplementaryHealth.faq2Q": "Who can purchase supplementary health insurance?",
  "insurance.supplementaryHealth.faq2A":
    "Many programmes insure persons from babies older than 14 days up to age 64 (inclusive) at first entry, subject to insurer acceptance criteria and medical disclosure — confirm the exact age band on your quote.",
  "insurance.supplementaryHealth.faq3Q": "What is the difference between supplementary health insurance and private health insurance?",
  "insurance.supplementaryHealth.faq3A":
    "Private health insurance products can vary widely in networks and benefit design. Supplementary health insurance is typically structured around SGK-coordinated access to contracted private providers and may offer a more affordable route when your priority is fee-difference cover rather than a fully private international-style plan.",
  "insurance.supplementaryHealth.faq4Q": "Will my supplementary health insurance cover my existing conditions?",
  "insurance.supplementaryHealth.faq4A":
    "Costs related to illnesses or conditions that existed before the policy start are generally excluded or subject to waiting periods — read your personal schedule and ask İlsa Insurance to explain how your disclosures map to underwriting.",
  "insurance.supplementaryHealth.faq5Q": "Is my supplementary health insurance policy valid abroad?",
  "insurance.supplementaryHealth.faq5A":
    "Typical supplementary products arranged for SGK coordination in Türkiye are not designed for treatment abroad. If you need cover overseas, ask İlsa Insurance about a separate travel health product that matches your destination and trip length.",
  "insurance.supplementaryHealth.faq6Q": "How many outpatient treatment coverages are included?",
  "insurance.supplementaryHealth.faq6A":
    "Outpatient visit entitlements depend on the package you choose — many insurers offer tiered programmes (for example higher versus standard outpatient visit limits). Your policy schedule states the exact number and any co-payments.",
  "insurance.supplementaryHealth.faq7Q": "How is premium calculated in supplementary health insurance?",
  "insurance.supplementaryHealth.faq7A":
    "Premiums depend on factors such as the plan tier, hospital network, age, risk area, and region, and are personalised at quote stage.",
  "insurance.supplementaryHealth.faq8Q": "Is supplementary health insurance tax deductible?",
  "insurance.supplementaryHealth.faq8A":
    "Premiums may be deductible from the income tax base within limits set under the Income Tax Law (for example caps linked to gross income and the annual minimum wage concept). This is general information only and is not tax advice — confirm with your accountant.",
  "insurance.supplementaryHealth.faq9Q": "What is the lifetime renewal guarantee for supplementary health insurance?",
  "insurance.supplementaryHealth.faq9A":
    "Where insurers promote a renewal guarantee, it is usually subject to medical and technical assessment, continuous renewal history, first entry before a stated age (often 64 inclusive), and the principle of utmost good faith. Exact conditions are defined only in the insurer’s policy wording.",
  "insurance.supplementaryHealth.docsTitle": "Supplementary health insurance — related documents",
  "insurance.supplementaryHealth.docsLead": "General health insurance terms, supplementary special terms, and the policy information form — keep copies with your policy file.",
  "insurance.supplementaryHealth.doc1Title": "General terms and conditions of health insurance",
  "insurance.supplementaryHealth.doc2Title": "Supplementary health insurance — special terms and conditions",
  "insurance.supplementaryHealth.doc3Title": "Supplementary health insurance — policy information form",
  "insurance.supplementaryHealth.docDownload": "Download the file",
  "insurance.supplementaryHealth.bottomCtaTitle": "Compare supplementary health plans",
  "insurance.supplementaryHealth.bottomCtaBody": "Contact İlsa Insurance for indicative quotes and help choosing a network that fits your family.",
  "insurance.supplementaryHealth.bottomCtaButton": "Contact us",
  "insurance.health.supplementaryPageLink": "View supplementary health insurance (TSS) details"
};

const TR = {
  "insurance.supplementaryHealth.breadcrumbCurrent": "Tamamlayıcı Sağlık Sigortası (TSS)",
  "insurance.supplementaryHealth.heroTitle": "Tamamlayıcı Sağlık Sigortası (TSS)",
  "insurance.supplementaryHealth.heroSubtitle": "SGK (Sosyal Güvenlik Kurumu) kapsamındakiler için ek sağlık güvencesi.",
  "insurance.supplementaryHealth.introP1":
    "Tamamlayıcı sağlık sigortası (TSS), SGK ile anlaşmalı özel hastanelerde sağlık hizmeti alırken SGK tarifesine ek düzenlenen ücret farklarını poliçe kapsamında karşılamanıza yardımcı olan bir üründür. Devlet hastanelerinin yanı sıra, seçtiğiniz ürünün limitleri dahilinde daha konforlu ve hızlı erişim sunar.",
  "insurance.supplementaryHealth.introP2":
    "İlsa Sigorta olarak bütçenize uygun tamamlayıcı sağlık seçeneklerini karşılaştırır, ortak sigorta şirketlerimizden size en uygun poliçeyi seçmenize yardımcı oluruz.",
  "insurance.supplementaryHealth.ctaPrimary": "Teklif alın",
  "insurance.supplementaryHealth.ctaSecondary": "Danışmanla görüşün",
  "insurance.supplementaryHealth.mockDisclaimer": "Örnek bilgilendirme sayfası — bağlayıcı teklif ve poliçe metni için İlsa Sigorta ile iletişime geçin.",
  "insurance.supplementaryHealth.coverTitle": "Tamamlayıcı sağlık sigortası neleri kapsar?",
  "insurance.supplementaryHealth.coverLead": "Seçilen poliçeye göre aşağıdaki teminatlar yer alabilir:",
  "insurance.supplementaryHealth.coverItem1": "Yatarak tedavi giderleri",
  "insurance.supplementaryHealth.coverItem2": "Ameliyat ve hastane giderleri",
  "insurance.supplementaryHealth.coverItem3": "Ayakta tedavi (hekim muayenesi)",
  "insurance.supplementaryHealth.coverItem4": "Analiz, tetkik ve görüntüleme",
  "insurance.supplementaryHealth.coverItem5": "Fizik tedavi hizmetleri (poliçede sunulduğunda)",
  "insurance.supplementaryHealth.coverItem6": "Doğum teminatı (isteğe bağlı paket, sunulduğunda)",
  "insurance.supplementaryHealth.coverFootnote": "Kapsam sigorta şirketine ve seçtiğiniz plana göre değişir.",
  "insurance.supplementaryHealth.whoTitle": "Kimler yararlanabilir?",
  "insurance.supplementaryHealth.whoItem1": "SGK’lı çalışanlar",
  "insurance.supplementaryHealth.whoItem2": "Emekliler",
  "insurance.supplementaryHealth.whoItem3": "Genellikle 0–65 yaş aralığındaki kişiler (teklifte netleştirilir)",
  "insurance.supplementaryHealth.whoItem4": "Aile poliçesi düzenlemek isteyenler",
  "insurance.supplementaryHealth.whoItem5": "SGK kapsamında olup özel hastanede koordineli hizmet isteyen herkes",
  "insurance.supplementaryHealth.whoFootnote": "Uygunluk, bekleme süreleri ve sağlık beyanı kuralları sigortacıya göre değişir — İlsa Sigorta poliçe öncesi birlikte kontrol eder.",
  "insurance.supplementaryHealth.whyProductTitle": "Neden tamamlayıcı sağlık sigortası?",
  "insurance.supplementaryHealth.whyProduct1": "Anlaşmalı özel hastanelerde ek ücret farkını azaltır veya kaldırır.",
  "insurance.supplementaryHealth.whyProduct2": "Randevu ve başvuru süreçlerinde daha az bekleme.",
  "insurance.supplementaryHealth.whyProduct3": "Daha konforlu tedavi seçenekleri (poliçe hastane listesine bağlı).",
  "insurance.supplementaryHealth.whyProduct4": "İhtiyaca uygun paketlerle avantajlı prim.",
  "insurance.supplementaryHealth.advSectionTitle": "Tamamlayıcı sağlık sigortası avantajları",
  "insurance.supplementaryHealth.advLead": "Doğru tamamlayıcı planla sağlığınızı güvence altına alın — teminatlar bağlayacağınız pakete göre değişir.",
  "insurance.supplementaryHealth.adv1Title": "Check-up",
  "insurance.supplementaryHealth.adv1Body":
    "Seçilen programlarda kan tahlilleri, akciğer grafisi, EKG ve kolesterol taraması gibi check-up unsurları yer alabilir — kesin menü bilgilendirme formundadır.",
  "insurance.supplementaryHealth.adv2Title": "Yaşam boyu yenileme (sunulduğu ürünlerde)",
  "insurance.supplementaryHealth.adv2Body":
    "Bazı ürünler kesintisiz yenileme vaadini şartlara bağlar; iyi niyet beyanı ve kabul kriterleri önemlidir — teklifinizdeki metni birlikte okuyun.",
  "insurance.supplementaryHealth.adv3Title": "Doğum teminatı",
  "insurance.supplementaryHealth.adv3Body":
    "İsteğe bağlı doğum paketleri; alt limitler ve bekleme süreleri poliçeye göre değişir.",
  "insurance.supplementaryHealth.adv4Title": "Diş kontrolü",
  "insurance.supplementaryHealth.adv4Body":
    "Anlaşmalı diş klinikleri ağı üzerinden yaş 1 itibariyle periyodik kontrol hakları birçok planda bulunabilir.",
  "insurance.supplementaryHealth.adv5Title": "Esnek plan ve ağ seçenekleri",
  "insurance.supplementaryHealth.adv5Body":
    "Farklı hastane listeleri ve ayakta tedavi paketleriyle kullanımınıza uygun poliçe oluşturabilirsiniz.",
  "insurance.supplementaryHealth.adv6Title": "18 yaş altı bireysel sigortalı",
  "insurance.supplementaryHealth.adv6Body":
    "Ürün kurallarına bağlı olarak çocuklar ayrı poliçe ile sigortalanabilir — İlsa Sigorta seçtiğiniz plan için netleştirir.",
  "insurance.supplementaryHealth.whyTitle": "Neden İlsa Sigorta?",
  "insurance.supplementaryHealth.why1": "Birden fazla sigorta şirketinden teklif karşılaştırması",
  "insurance.supplementaryHealth.why2": "Uygun fiyat seçenekleri",
  "insurance.supplementaryHealth.why3": "Ankara merkezli danışmanlık",
  "insurance.supplementaryHealth.why4": "Hızlı poliçe düzenleme",
  "insurance.supplementaryHealth.why5": "Yenileme hatırlatma ve poliçe sürecinde destek",
  "insurance.supplementaryHealth.expertLabel": "Uzmanımız diyor ki",
  "insurance.supplementaryHealth.expertSlide1Quote": "Önce gerçekten gittiğiniz hastane listesini netleştirin — ağ dışı kalırsanız tamamlayıcının değeri azalır.",
  "insurance.supplementaryHealth.expertSlide1Name": "Mehmet Yılmaz",
  "insurance.supplementaryHealth.expertSlide1Role": "Sağlık branşı — İlsa Sigorta",
  "insurance.supplementaryHealth.expertSlide2Quote": "Ayakta vizit adedi, katkı payı ve kronik takip istisnalarını mutlaka sorun — memnuniyeti belirleyen kısım genelde budur.",
  "insurance.supplementaryHealth.expertSlide2Name": "Ayşe Demir",
  "insurance.supplementaryHealth.expertSlide2Role": "Müşteri danışmanlığı — İlsa Sigorta",
  "insurance.supplementaryHealth.expertSlide3Quote": "Sık yurt dışına çıkıyorsanız yurt içi TSS’yi otomatik yurt dışı sanmayın — gerekirse seyahat sağlığını ayrıca değerlendirin.",
  "insurance.supplementaryHealth.expertSlide3Name": "Can Öztürk",
  "insurance.supplementaryHealth.expertSlide3Role": "Hasar masası — İlsa Sigorta",
  "insurance.supplementaryHealth.faqSectionTitle": "Sıkça sorulan sorular",
  "insurance.supplementaryHealth.faqSectionLead":
    "Tamamlayıcı sağlık sigortasıyla ilgili sık sorulan soruların yanıtlarını aşağıda bulabilirsiniz. Kişisel durumunuz için bağlayıcı bilgi için İlsa Sigorta ile iletişime geçin.",
  "insurance.supplementaryHealth.faqAllQuestions": "Tüm sorular",
  "insurance.supplementaryHealth.faqSeeMore": "Daha fazla soru",
  "insurance.supplementaryHealth.faqSeeLess": "Daha az göster",
  "insurance.supplementaryHealth.faq1Q": "Tamamlayıcı sağlık sigortası nedir?",
  "insurance.supplementaryHealth.faq1A":
    "Tamamlayıcı sağlık sigortası; SGK ile anlaşmalı özel hastanelerde, poliçenizin limit ve istisnaları çerçevesinde SGK düzenlemelerine bağlı ücret farklarını yönetmenize yardımcı olan özel sağlık ürünüdür. Yasal zorunlu SGK katkı payı kuralları saklıdır.",
  "insurance.supplementaryHealth.faq2Q": "Tamamlayıcı sağlık sigortasını kimler yaptırabilir?",
  "insurance.supplementaryHealth.faq2A":
    "Çoğu ürün 14 günlük bebekten itibaren ve ilk girişte 64 yaş (dahil) üst sınırına kadar kabul edilebilirlik şartlarına tabidir — kesin yaş bandı teklifinizde yer alır.",
  "insurance.supplementaryHealth.faq3Q": "Tamamlayıcı ile özel sağlık sigortası farkı nedir?",
  "insurance.supplementaryHealth.faq3A":
    "Özel sağlık ürünleri ağ ve teminat yapısına göre geniş çeşitlilik gösterir. Tamamlayıcı sigorta genellikle SGK ile koordineli özel hastane erişimine odaklanır ve önceliğiniz fark ücreti yönetimi ise daha uygun maliyetli bir rota sunabilir.",
  "insurance.supplementaryHealth.faq4Q": "Mevcut hastalıklarımı kapsar mı?",
  "insurance.supplementaryHealth.faq4A":
    "Poliçe başlangıcından önce var olan rahatsızlıklara bağlı giderler genelde hariç tutulur veya bekleme süresine tabidir — kişisel tablonuzu İlsa Sigorta ile birlikte okuyun.",
  "insurance.supplementaryHealth.faq5Q": "Tamamlayıcı sağlık sigortası yurt dışında geçerli midir?",
  "insurance.supplementaryHealth.faq5A":
    "Türkiye’de SGK koordinasyonu için düzenlenen tipik tamamlayıcı ürünler yurt dışı tedaviyi kapsamaz. Yurt dışı için ayrı seyahat sağlığı ürününü İlsa Sigorta’dan talep edin.",
  "insurance.supplementaryHealth.faq6Q": "Ayakta tedavi kaç seans/kapsam içerir?",
  "insurance.supplementaryHealth.faq6A":
    "Ayakta haklar seçtiğiniz pakete göre değişir; birçok şirket üst ve standart vizit limitli paketler sunar. Kesin sayı poliçe tablonuzdadır.",
  "insurance.supplementaryHealth.faq7Q": "Tamamlayıcı sağlık primi nasıl hesaplanır?",
  "insurance.supplementaryHealth.faq7A":
    "Prim; plan seviyesi, hastane ağı, yaş, risk bölgesi ve bölge gibi faktörlere göre kişiselleştirilir.",
  "insurance.supplementaryHealth.faq8Q": "Tamamlayıcı sağlık primi vergiden düşülür mü?",
  "insurance.supplementaryHealth.faq8A":
    "Gelir Vergisi Kanunu çerçevesinde brüt gelire ve asgari ücret tutarına bağlı sınırlar dahilinde indirim mümkün olabilir. Bu genel bilgidir; vergi danışmanınıza danışın.",
  "insurance.supplementaryHealth.faq9Q": "Yaşam boyu yenileme garantisi nedir?",
  "insurance.supplementaryHealth.faq9A":
    "Varsa, genellikle tıbbi/teknik değerlendirme, kesintisiz yenileme, ilk giriş yaş sınırı ve iyi niyet ilkesi gibi şartlara bağlıdır. Yalnızca sigortacı poliçe metninde tanımlanır.",
  "insurance.supplementaryHealth.docsTitle": "Tamamlayıcı sağlık sigortası — ilgili belgeler",
  "insurance.supplementaryHealth.docsLead": "Genel sağlık şartları, tamamlayıcı özel şartlar ve poliçe bilgilendirme formu — poliçe dosyanızda saklayın.",
  "insurance.supplementaryHealth.doc1Title": "Sağlık sigortası genel şartları",
  "insurance.supplementaryHealth.doc2Title": "Tamamlayıcı sağlık sigortası özel şartları",
  "insurance.supplementaryHealth.doc3Title": "Tamamlayıcı sağlık sigortası poliçe bilgilendirme formu",
  "insurance.supplementaryHealth.docDownload": "Dosyayı indir",
  "insurance.supplementaryHealth.bottomCtaTitle": "Tamamlayıcı sağlık planlarını karşılaştırın",
  "insurance.supplementaryHealth.bottomCtaBody": "Gösterge teklif ve aileye uygun ağ seçimi için İlsa Sigorta ile iletişime geçin.",
  "insurance.supplementaryHealth.bottomCtaButton": "İletişime geç",
  "insurance.health.supplementaryPageLink": "Tamamlayıcı sağlık sigortası (TSS) sayfasına git"
};

function mergeEn() {
  const filePath = path.join(localesDir, "en.json");
  const loc = JSON.parse(fs.readFileSync(filePath, "utf8"));
  for (const k of Object.keys(loc)) {
    if (
      k.startsWith("insurance.supplementaryHealth.") ||
      k.startsWith("insurance.common.") ||
      k === "insurance.health.supplementaryPageLink"
    ) {
      delete loc[k];
    }
  }
  Object.assign(loc, COMMON_EN, EN);
  fs.writeFileSync(filePath, JSON.stringify(loc, null, 2) + "\n");
  console.log("wrote en.json");
}

function mergeTr() {
  const filePath = path.join(localesDir, "tr.json");
  const loc = JSON.parse(fs.readFileSync(filePath, "utf8"));
  for (const k of Object.keys(loc)) {
    if (k.startsWith("insurance.supplementaryHealth.") || k === "insurance.health.supplementaryPageLink") delete loc[k];
  }
  Object.assign(loc, TR);
  fs.writeFileSync(filePath, JSON.stringify(loc, null, 2) + "\n");
  console.log("wrote tr.json");
}

mergeEn();
mergeTr();
console.log("Done.");
