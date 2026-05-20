import type { Payload } from 'payload'

import { doc, h, p, ul } from './lexical'
import { slugify } from './slug'

const DEFAULT_CATEGORIES = [
  { name: 'Hamilelik', description: 'Gebelik süreci, doğum öncesi bakım, beslenme ve psikoloji.' },
  { name: '0-6 Ay', description: 'Yenidoğan bakımı, ilk aylar, emzirme, uyku.' },
  { name: '6-12 Ay', description: 'Ek gıdaya geçiş, gelişim, ilk dişler.' },
  { name: '1-3 Yaş', description: 'Yürüme, konuşma, oyun, beslenme alışkanlıkları.' },
  { name: 'Anne Sağlığı', description: 'Doğum sonrası fiziksel ve ruhsal sağlık.' },
  { name: 'Beslenme', description: 'Anne ve bebek için günlük beslenme, tarifler, ipuçları.' },
]

const SEED_EXPERTS = [
  {
    name: 'Ayşe Yıldız',
    expertise: 'diyetisyen' as const,
    title: 'Klinik Diyetisyen',
    bioText:
      'Anne–bebek beslenmesi üzerine on yıllık deneyimi olan klinik diyetisyen. Hamilelik, emzirme ve ek gıda süreçlerinde aileye sıcak, bilimsel bir yol arkadaşı.',
  },
  {
    name: 'Hatice Demir',
    expertise: 'ebe' as const,
    title: 'Ebe ve Doğum Danışmanı',
    bioText:
      'Doğum öncesi hazırlık ve doğum sonrası iyileşmede yıllardır anneleri destekliyor. "Doğum bir kriz değil, bir geçiş" diyor — kalbiyle dinleyen bir ebe.',
  },
  {
    name: 'Dr. Mehmet Aslan',
    expertise: 'doktor' as const,
    title: 'Pediatri Uzmanı',
    bioText:
      'Çocuk sağlığı ve hastalıkları uzmanı. Korkutmadan bilgi veren, "kitaba göre" değil "çocuğa göre" konuşan bir hekim.',
  },
]

const SEED_POSTS: {
  title: string
  excerpt: string
  expertiseAuthor: 'diyetisyen' | 'ebe' | 'doktor'
  categoryName: string
  content: ReturnType<typeof doc>
  neneNote: ReturnType<typeof doc>
}[] = [
  {
    title: 'Emzirme döneminde annenin tabağında ne olmalı?',
    excerpt:
      'Emziren annenin günlük beslenmesi nasıl olmalı? Süt için "mucize" yiyecek var mı? Sade, gerçekçi bir liste.',
    expertiseAuthor: 'diyetisyen',
    categoryName: '0-6 Ay',
    content: doc(
      p(
        'Emzirme dönemi, anneye ekstra bir baskı dönemi gibi anlatılır. Aslında temel kural çok basit: ',
        { type: 'text', detail: 0, format: 1, mode: 'normal', style: '', text: 'çeşitli, yeterli ve düzenli', version: 1 } as never,
        ' beslenmek. Süt üretimini patlatan tek bir yiyecek yok; bütüne bakacağız.',
      ),
      h(2, 'Günlük tabakta dengeleyici dört kalem'),
      ul(
        'Kaliteli protein: yumurta, kefir, peynir, mercimek, tavuk, balık.',
        'Tam tahıl: bulgur, yulaf, çavdar ekmek. Enerji yavaş yavaş gelsin.',
        'Renkli sebze ve meyve: günde en az 5 porsiyon, mevsiminde ne varsa.',
        'Yağlı tohum ve zeytinyağı: bir avuç ceviz, badem; her öğüne 1 yemek kaşığı zeytinyağı.',
      ),
      h(2, 'Su, çay, kahve'),
      p(
        'Bol su iç ama "şişe başında günü geçirme" şart değil. Susadığında, her emzirme öncesinde bir bardak su iyi bir alışkanlık. Kahveyi tamamen bırakmaya gerek yok; günde 1–2 fincanla sınırla, emzirmeden hemen önce içme.',
      ),
      h(2, '"Sütünü artıran" yiyecekler'),
      p(
        'Çoğu zaman duyduğun "şu yiyince sütüm coştu" cümlesi, aslında o yiyecekle birlikte daha çok dinlenmek ve daha sık emzirmekle alakalı. Süt arzı, talebi takip eder. Yine de keyif veren içecekler (rezene çayı gibi) zarar vermez.',
      ),
      h(2, 'Kaçınılması iyi olanlar'),
      ul(
        'Çiğ ya da az pişmiş hayvansal ürünler.',
        'Yüksek civalı balıklar (kılıç, köpek balığı). Hamsi, somon, sardalye gönül rahatlığıyla.',
        'Bitkisel takviyeler (özellikle "süt artırıcı" diye satılan kapsüller) doktoruna sormadan kullanma.',
      ),
    ),
    neneNote: doc(
      p(
        'Tabağın renkli olsun, mutfağına ısıt­ılmış zeytinyağı kokusu yayılsın. Kendine yemek yap, ayakta yemek yeme. Anne doyarsa, ev de doyar.',
      ),
    ),
  },
  {
    title: 'Doğum çantasında ne olsun, neyi unutursan canın yanmaz?',
    excerpt:
      'Hastane çantasında gerçekten lazım olanlar ve "olmasa da olur" listesi. Bir ebe gözünden sade bir rehber.',
    expertiseAuthor: 'ebe',
    categoryName: 'Hamilelik',
    content: doc(
      p(
        '36. haftadan itibaren çantayı hazır tut. "Her ihtimale karşı" diye dolaba doldurmaya gerek yok — pratik bir çanta, panikten yarısı kadar yer kaplar.',
      ),
      h(2, 'Anne için olmazsa olmazlar'),
      ul(
        'Kimlik, hasta yatış evrakları, varsa son tahlil sonuçları.',
        'Önden açılan rahat 2 gecelik, sütyen pedi, emzirme sütyeni.',
        'Büyük beden iç çamaşırı (sezaryen veya doğum sonrası rahatlık için).',
        'Hijyenik ped (gece pedinin uzun ve emici olanı).',
        'Şarjlı telefon + powerbank, terlik, ince hırka.',
      ),
      h(2, 'Bebek için yeterlisi'),
      ul(
        'İlk birkaç saat için 2 zıbın, 1 tulum, 1 battaniye.',
        'Yenidoğan bezi (1 paket fazla yeterli, marka denemek için minik paket).',
        'Hastaneden çıkış için mevsime uygun bir takım.',
      ),
      h(2, 'Olmasa da olur'),
      p(
        'Bebek pudrası, bornoz, "anne kreminden" mucize beklediğin şişeler. Bunlar evde dursun, ihtiyaç doğarsa eşin getirir.',
      ),
      h(2, 'Zihinsel hazırlık'),
      p(
        'Çantanı toplarken aslında zihnini hazırlıyorsun. "Hazır mıyım?" sorusunun cevabı asla %100 evet olmayacak — bu normal. Doğum, planın değil sürecin senin yerine yazdığı bir gün.',
      ),
    ),
    neneNote: doc(
      p(
        'Bir tane de eski, yumuşak bir havlu koy. Annemin annesi koyardı: "Kendini kurularken çocukluğunu hatırla" derdi.',
      ),
    ),
  },
  {
    title: 'Bebeğim ateşlendi: ne zaman doktora, ne zaman beklenir?',
    excerpt:
      'Her ateş acil değil, ama hangisi öyle? 0–3 ay, 3–24 ay, 2 yaş üstü için pratik bir karar haritası.',
    expertiseAuthor: 'doktor',
    categoryName: '6-12 Ay',
    content: doc(
      p(
        'Ateş bir hastalık değil, vücudun bir savunma cevabıdır. Yüksek olması her zaman tehlikeli değildir; düşük olması her zaman güvenli demek değildir. Yaş bandı, ateşi yorumlarken en önemli filtredir.',
      ),
      h(2, '0–3 ay arası'),
      p(
        'Bu yaş grubunda rektal ölçümle 38°C ve üzeri her ateş, hekim değerlendirmesi gerektirir. Beklemeden bir pediatri acile başvurun. Bebek "iyi görünüyor" olsa bile.',
      ),
      h(2, '3–24 ay arası'),
      ul(
        '39°C üstü ateş, 24 saatten uzun süren ateş veya genel durumda belirgin bozulma → doktor.',
        'Bebek hâlâ ilgili, su içiyor, oynayabiliyorsa 38–39°C arası bir gece evde takip edilebilir.',
        'Ateş düşürücü (parasetamol/ibuprofen) "ateşi normale indirmek" için değil, çocuğun konforu için verilir.',
      ),
      h(2, '2 yaş ve üstü'),
      p(
        'Genel durumu izleyin: aktif mi, sıvı alıyor mu, idrara çıkıyor mu? Ateş 3 günden uzun sürerse veya yeni belirtiler (döküntü, nefes darlığı, sürekli kusma) eklenirse hekime başvurun.',
      ),
      h(2, 'Acil bayrak: hemen başvuru'),
      ul(
        'Ense sertliği, ışıktan rahatsız olma, mor benekli döküntü.',
        'Nefes alıp vermede zorluk, hızlı/inlemeli soluk.',
        'Bilinç bulanıklığı, sürekli uyuklama, havale.',
        'İdrarda belirgin azalma, ağız kuruluğu.',
      ),
      h(2, 'Eve ait pratikler'),
      p(
        'Hafif giydir, oda sıcaklığını 22–24°C civarında tut. Ilık duş (asla soğuk) konfora yardımcı olabilir. Alkollü sürme, sirkeli pansuman gibi geleneksel yöntemleri kullanma — etkisi yok, zararı olabilir.',
      ),
    ),
    neneNote: doc(
      p(
        'Eskiden derdik ki "ateş yaparsa, çocuk bir şey ekliyor demektir." Doğru yanı şu: ateş bir alarm sistemi. Önemli olan alarmın sesi değil, neyi söylediği.',
      ),
    ),
  },
]

export async function runSeed(payload: Payload): Promise<void> {
  await seedCategories(payload)
  await seedExperts(payload)
  await seedPosts(payload)
  await seedQuestions(payload)
  await seedProducts(payload)
}

async function seedCategories(payload: Payload): Promise<void> {
  const existing = await payload.count({ collection: 'categories' })
  if (existing.totalDocs > 0) return
  payload.logger.info('Seeding default categories…')
  for (const cat of DEFAULT_CATEGORIES) {
    await payload.create({
      collection: 'categories',
      data: {
        name: cat.name,
        slug: slugify(cat.name),
        description: cat.description,
      },
    })
  }
  payload.logger.info(`Seeded ${DEFAULT_CATEGORIES.length} categories.`)
}

async function seedExperts(payload: Payload): Promise<void> {
  const existing = await payload.count({ collection: 'experts' })
  if (existing.totalDocs > 0) return
  payload.logger.info('Seeding default experts…')
  for (const e of SEED_EXPERTS) {
    await payload.create({
      collection: 'experts',
      data: {
        name: e.name,
        slug: slugify(e.name),
        expertise: e.expertise,
        title: e.title,
        bio: doc(p(e.bioText)) as never,
      },
    })
  }
  payload.logger.info(`Seeded ${SEED_EXPERTS.length} experts.`)
}

const SEED_QUESTIONS: {
  questionTitle: string
  questionBody: string
  askerName: string
  expertiseAnswerer: 'diyetisyen' | 'ebe' | 'doktor'
  categoryName: string
  answer: ReturnType<typeof doc>
}[] = [
  {
    questionTitle: '4 aylık bebeğim gece sürekli uyanıyor, normal mi?',
    questionBody:
      "Bebeğim 4 aylık. İlk üç ay gece 5–6 saat kesintisiz uyuyordu, son iki haftadır gece 1–2 saatte bir uyanıyor. Bir şey mi yanlış yapıyorum? Mama mı az geliyor?",
    askerName: 'Yıldız',
    expertiseAnswerer: 'ebe',
    categoryName: '0-6 Ay',
    answer: doc(
      p(
        'Yaşadığın çok yaygın — 4 aylık uyku gerilemesi (sleep regression). Mama az geldiğinden değil, bebeğin uyku siklusu olgunlaşıyor: artık daha yetişkin bir uyku düzenine geçiyor ve siklusların arasında kısa uyanıklıklar oluyor.',
      ),
      h(3, 'Birkaç pratik'),
      ul(
        'Yatış saatini sabit tut (örn. her gece 19:30–20:00 arası). Tutarlılık, geçişi kolaylaştırıyor.',
        'Gece uyandığında hemen kucağa almak yerine 1–2 dakika bekle. Kendini geri uyutmayı öğrenmesi haftalar sürebilir.',
        'Karanlık + sessiz + 22°C civarı bir oda yardımcı olur.',
        'Gündüz uyumalarını çok uzun tutmamak (toplam 3–4 saat) gece uykusunu koruyor.',
      ),
      p(
        'Bu dönem 2–6 hafta sürer ve geçer. Eğer kilo alımı normalse mama miktarını arttırmana gerek yok.',
      ),
      p(
        'Yine de bebekte huzursuzluk, kusma, idrar azalması gibi başka belirtiler varsa pediatrına başvur.',
      ),
    ),
  },
  {
    questionTitle: 'Ek gıdaya ne zaman başlanır, ilk ne verilmeli?',
    questionBody:
      'Bebeğim 5 aylık olacak, kayınvalidem "bekleme, yoğurt başla" diyor, internette herkes 6 ay diyor. Ne zaman ve neyle başlamak doğru?',
    askerName: 'Selin',
    expertiseAnswerer: 'diyetisyen',
    categoryName: '6-12 Ay',
    answer: doc(
      p(
        "Dünya Sağlık Örgütü ve Sağlık Bakanlığı önerisi: tam 6 ay (180 gün) anne sütüne ek olarak ek gıdaya başlamak. Erken başlamak alerji ve mide–bağırsak sorunları riskini artırabiliyor.",
      ),
      h(3, 'Hazır olma işaretleri'),
      ul(
        'Bebek başını dik tutabiliyor.',
        'Desteksiz oturabiliyor veya çok az desteklenerek oturabiliyor.',
        'Yiyeceğe ilgi gösteriyor, ağzına bir şey verince dilini öne çıkarmıyor (extrusion refleksi azalmış).',
      ),
      h(3, 'İlk gıdalar — sade başla'),
      ul(
        'Demir açısından zengin: yumurta sarısı, iyi pişmiş etli sebze püresi, mercimek.',
        'Sebze püreleri: kabak, havuç, brokoli, patates (tek tek dene, 3 gün ara ile yeni gıda ekle).',
        'Meyveler: muz, armut, elma püresi.',
        'Demir takviyeli bebek tahılları (ülkemizdeki çocuk doktorlarının önerisine göre 6.aydan itibaren kullanılır).',
      ),
      h(3, 'Kaçınılacaklar'),
      ul(
        '1 yaşa kadar inek sütü (yoğurt 8. aydan sonra önerilir).',
        'Bal 1 yaş öncesi (botulizm riski).',
        'Tuz ve şeker eklemek.',
      ),
      p(
        'İlk 6 ay anne sütü yeterli ve eşsiz. Geleneksel "5. ay yoğurt" tavsiyesi sevgiyle ama eski bir bilgiyle söyleniyor — bugünkü öneri 6 ay.',
      ),
    ),
  },
]

async function seedQuestions(payload: Payload): Promise<void> {
  const existing = await payload.count({ collection: 'questions' })
  if (existing.totalDocs > 0) return

  payload.logger.info('Seeding default questions…')

  const experts = await payload.find({ collection: 'experts', limit: 50 })
  const expertByExpertise = new Map<string, number>()
  for (const e of experts.docs as unknown as {
    id: number
    expertise: string
  }[]) {
    expertByExpertise.set(e.expertise, e.id)
  }

  const categories = await payload.find({ collection: 'categories', limit: 50 })
  const categoryByName = new Map<string, number>()
  for (const c of categories.docs as unknown as { id: number; name: string }[]) {
    categoryByName.set(c.name, c.id)
  }

  let created = 0
  for (const q of SEED_QUESTIONS) {
    const expertId = expertByExpertise.get(q.expertiseAnswerer)
    const categoryId = categoryByName.get(q.categoryName)
    if (!expertId || !categoryId) continue
    const baseSlug = slugify(q.questionTitle)
    await payload.create({
      collection: 'questions',
      context: { skipRevalidate: true },
      data: {
        questionTitle: q.questionTitle,
        slug: `${baseSlug}-${created + 1}`,
        questionBody: q.questionBody,
        askerName: q.askerName,
        askerEmail: 'seed@nenenesor.com',
        category: categoryId,
        assignedExpert: expertId,
        answer: q.answer as never,
        status: 'published',
        publishedAt: new Date().toISOString(),
      },
    })
    created++
  }

  payload.logger.info(`Seeded ${created} questions.`)
}

type SeedProductItem = {
  name: string
  reason: string
  expertNote?: string
  affiliateLinks: { retailer: 'hepsiburada' | 'trendyol' | 'ebebek' | 'amazon'; url: string }[]
}

const SEED_PRODUCTS: {
  title: string
  expertiseAuthor: 'diyetisyen' | 'ebe' | 'doktor'
  categoryName: string
  intro: ReturnType<typeof doc>
  items: SeedProductItem[]
  metaDescription: string
}[] = [
  {
    title: 'Doğum çantasında nene ile uzmanın anlaştığı 6 şey',
    expertiseAuthor: 'ebe',
    categoryName: 'Hamilelik',
    metaDescription:
      'Hastane çantasında gerçekten lazım olanlar. Ebe gözünden seçilmiş 6 ürün.',
    intro: doc(
      p(
        '36. haftadan itibaren hazır bulundurman gereken çantanın "panik almadan" toplanmış hali. Her ürünün altında "neden bu" yazıyor — ezbere değil, gerekçeyle.',
      ),
      p(
        'Bu liste pratik bir başlangıç noktasıdır; herkesin doğum koşulları farklı, hastanenin sağladıkları farklı olabilir. Önce hastaneye bir sor, sonra eksiklerine bak.',
      ),
    ),
    items: [
      {
        name: 'Önden açılan emzirme geceliği',
        reason:
          'Doğum sonrası birkaç gün — özellikle ilk emzirmelerde — önden çıt çıt veya düğmeli açılan modeller hayat kurtarır. Kafadan giyme modeller hem kolu, hem sezaryen yarasını sıkıştırır.',
        expertNote:
          'En az 2 adet al, biri ıslanırsa ikincisi hazır olsun.',
        affiliateLinks: [
          { retailer: 'trendyol', url: 'https://www.trendyol.com/sr?q=emzirme%20gecelik' },
          { retailer: 'hepsiburada', url: 'https://www.hepsiburada.com/ara?q=emzirme%20gecelik' },
        ],
      },
      {
        name: 'Doğum sonrası büyük beden iç çamaşırı',
        reason:
          'Sezaryen olursan dikiş bölgesini sıkmayan, normal doğumda da pedi rahat tutan, bele kadar gelen modeller — geleneksel "lohusa külotu" gibi olanlar — ilk haftalarda en konforlusudur. İnce dantelli olanları doğumdan sonra bir kenara koy.',
        affiliateLinks: [
          { retailer: 'ebebek', url: 'https://www.ebebek.com/lohusa-ic-camasiri' },
          { retailer: 'trendyol', url: 'https://www.trendyol.com/sr?q=lohusa%20ic%20camasiri' },
        ],
      },
      {
        name: 'Uzun ve emici gece pedi',
        reason:
          'Doğum sonrası ilk hafta normalden çok daha fazla akıntı olur (lochia). Standart pedler yeterli gelmez. "Gece" yazan, kalın ve uzun olanları al — markası önemli değil, "ekstra emici" işaretine bak.',
        affiliateLinks: [
          { retailer: 'amazon', url: 'https://www.amazon.com.tr/s?k=ekstra+emici+gece+pedi' },
          { retailer: 'hepsiburada', url: 'https://www.hepsiburada.com/ara?q=lohusa%20pedi' },
        ],
      },
      {
        name: 'Emzirme sütyeni ve göğüs pedi',
        reason:
          'Süt patladığında (3-5. gün) göğüsler şişer, akma normaldir. Pamuklu emzirme sütyeni + tek kullanımlık göğüs pedi seti, ilk haftaların en pratik kombinasyonudur.',
        expertNote:
          'Yeniden kullanılabilir bambu pedler de uzun vadede ekonomik — yanına 3-4 paket koy.',
        affiliateLinks: [
          { retailer: 'trendyol', url: 'https://www.trendyol.com/sr?q=emzirme%20sutyeni' },
          { retailer: 'ebebek', url: 'https://www.ebebek.com/emzirme-sutyeni' },
        ],
      },
      {
        name: 'Bebek için 5\'li yenidoğan zıbın seti',
        reason:
          'Bebek doğduğunda 50–56 beden alır. İlk hafta sürekli kıyafet değiştireceksin (kusma, kaka, ısı). En az 5 zıbın + 3 tulum, %100 pamuk olmalı.',
        affiliateLinks: [
          { retailer: 'ebebek', url: 'https://www.ebebek.com/yenidogan-zibin' },
          { retailer: 'trendyol', url: 'https://www.trendyol.com/sr?q=yenidogan%20zibin' },
        ],
      },
      {
        name: 'Termos + kapaklı bardak',
        reason:
          'Emzirirken susarsın ama yanına yetişemezsin. Çift cidarlı bir termosu ılık suyla doldur, yanına koy. Kapaklı pipetli bardak doğumda yatakta su içmek için çok pratik.',
        affiliateLinks: [
          { retailer: 'amazon', url: 'https://www.amazon.com.tr/s?k=cift+cidarli+termos' },
          { retailer: 'hepsiburada', url: 'https://www.hepsiburada.com/ara?q=pipetli%20bardak' },
        ],
      },
    ],
  },
  {
    title: 'Ek gıdaya geçişte annelerin en çok sorduğu 5 ürün',
    expertiseAuthor: 'diyetisyen',
    categoryName: '6-12 Ay',
    metaDescription:
      "Ek gıdaya hazırlık için diyetisyen onaylı, sade bir başlangıç seti.",
    intro: doc(
      p(
        '6 ay dolduğunda bebek ek gıdaya başlamaya hazır. Bu rehberde, "ne almazsam başlayamam?" diye düşündüren beş ürün — uzman gözünden, sadelik filtresinden geçirilmiş.',
      ),
      p(
        'Ürün önerileri rehber niteliğindedir; bebeğin sağlık durumuna ve aile bütçene göre uyarla. Marka tavsiyesi değil, kategoride bakman gerekenleri anlatıyoruz.',
      ),
    ),
    items: [
      {
        name: 'Mama sandalyesi',
        reason:
          'Bebeğin desteksiz oturabildiği bir yer şart. Yıkanabilir tablası, ayak desteği ve kemer sistemi olmalı. Yere çok yakın "booster" modeller gezici aileler için pratik ama günlük ev kullanımında klasik yüksek model daha rahat.',
        expertNote:
          '5 noktadan kemer + ayak desteği — bu iki şey, yutma güvenliği için kritik.',
        affiliateLinks: [
          { retailer: 'ebebek', url: 'https://www.ebebek.com/mama-sandalyesi' },
          { retailer: 'trendyol', url: 'https://www.trendyol.com/sr?q=mama%20sandalyesi' },
        ],
      },
      {
        name: 'Silikon önlük',
        reason:
          'Cep gibi alttan oluğu olan silikon önlükler, yere düşeni yakalar — yer temizliğini yarıya indirir. Bezden farkı: yıkanabilir, hızlı kurur, leke tutmaz.',
        affiliateLinks: [
          { retailer: 'amazon', url: 'https://www.amazon.com.tr/s?k=silikon+mama+onlugu' },
          { retailer: 'hepsiburada', url: 'https://www.hepsiburada.com/ara?q=silikon%20mama%20onlugu' },
        ],
      },
      {
        name: 'Ek gıda hazırlık kabı (5x100 ml)',
        reason:
          'Bir hafta için 5-7 farklı sebzeyi püre yapıp dondurmak en pratik yöntem. Cam ya da BPA içermeyen plastik, kapaklı, 100 ml kapasiteli setler arıyoruz. Etiket koyabileceğin yüzeyi varsa bonus.',
        affiliateLinks: [
          { retailer: 'trendyol', url: 'https://www.trendyol.com/sr?q=ek%20gida%20saklama%20kabi' },
          { retailer: 'ebebek', url: 'https://www.ebebek.com/ek-gida-saklama' },
        ],
      },
      {
        name: 'Yumuşak silikon kaşık',
        reason:
          'İlk aylarda metal kaşık değil — yumuşak silikon, bebeğin diş etini incitmez. 2-3 adet idealdir, biri masada biri çantada.',
        affiliateLinks: [
          { retailer: 'amazon', url: 'https://www.amazon.com.tr/s?k=silikon+bebek+kasigi' },
          { retailer: 'ebebek', url: 'https://www.ebebek.com/bebek-kasigi' },
        ],
      },
      {
        name: 'Kapaklı eğitim bardağı (sippy/360)',
        reason:
          '6 ay sonrası sıvı su için bardak öğrenmeye başlanır. 360° açıdan içilebilen "magic cup" tarzı modeller, dudak gelişimi için biberon emziğinden daha doğru. Damıltırmadan içmeyi öğretir.',
        affiliateLinks: [
          { retailer: 'ebebek', url: 'https://www.ebebek.com/bebek-bardagi' },
          { retailer: 'hepsiburada', url: 'https://www.hepsiburada.com/ara?q=360%20derece%20bebek%20bardak' },
        ],
      },
    ],
  },
]

async function seedProducts(payload: Payload): Promise<void> {
  const existing = await payload.count({ collection: 'products' })
  if (existing.totalDocs > 0) return

  payload.logger.info('Seeding default product guides…')

  const experts = await payload.find({ collection: 'experts', limit: 50 })
  const expertByExpertise = new Map<string, number>()
  for (const e of experts.docs as unknown as {
    id: number
    expertise: string
  }[]) {
    expertByExpertise.set(e.expertise, e.id)
  }

  const categories = await payload.find({ collection: 'categories', limit: 50 })
  const categoryByName = new Map<string, number>()
  for (const c of categories.docs as unknown as { id: number; name: string }[]) {
    categoryByName.set(c.name, c.id)
  }

  let created = 0
  for (const g of SEED_PRODUCTS) {
    const authorId = expertByExpertise.get(g.expertiseAuthor)
    const categoryId = categoryByName.get(g.categoryName)
    if (!authorId || !categoryId) continue
    await payload.create({
      collection: 'products',
      context: { skipRevalidate: true },
      data: {
        title: g.title,
        slug: slugify(g.title),
        intro: g.intro as never,
        items: g.items,
        author: authorId,
        category: categoryId,
        status: 'published',
        publishedAt: new Date().toISOString(),
        seo: { metaDescription: g.metaDescription },
      },
    })
    created++
  }

  payload.logger.info(`Seeded ${created} product guides.`)
}

async function seedPosts(payload: Payload): Promise<void> {
  const existing = await payload.count({ collection: 'posts' })
  if (existing.totalDocs > 0) return
  payload.logger.info('Seeding default posts…')

  const experts = await payload.find({ collection: 'experts', limit: 50 })
  const expertByExpertise = new Map<string, number>()
  for (const e of experts.docs as unknown as {
    id: number
    expertise: string
  }[]) {
    expertByExpertise.set(e.expertise, e.id)
  }

  const categories = await payload.find({ collection: 'categories', limit: 50 })
  const categoryByName = new Map<string, number>()
  for (const c of categories.docs as unknown as { id: number; name: string }[]) {
    categoryByName.set(c.name, c.id)
  }

  let created = 0
  for (const post of SEED_POSTS) {
    const authorId = expertByExpertise.get(post.expertiseAuthor)
    const categoryId = categoryByName.get(post.categoryName)
    if (!authorId || !categoryId) continue
    await payload.create({
      collection: 'posts',
      context: { skipRevalidate: true },
      data: {
        title: post.title,
        slug: slugify(post.title),
        excerpt: post.excerpt,
        content: post.content as never,
        neneNote: post.neneNote as never,
        author: authorId,
        category: categoryId,
        status: 'published',
        publishedAt: new Date().toISOString(),
      },
    })
    created++
  }

  payload.logger.info(`Seeded ${created} posts.`)
}
