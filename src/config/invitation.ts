// Davetiyenin tüm içeriği bu dosyadan yönetilir.
// İsim, tarih, adres, galeri ve müzik gibi bilgileri değiştirmek için
// sadece bu dosyayı düzenlemeniz yeterlidir.

export const invitationConfig = {
  couple: {
    bride: "Satı Nur",
    groom: "Batuhan",
    brideFamily: "Tamkoç Ailesi",
    groomFamily: "Can Ailesi",
  },

  event: {
    title: "Söz Törenimiz",
    // ISO 8601 formatında, yerel saat dilimine göre
    isoDate: "2026-07-26T18:00:00",
    dateLabel: "26 Temmuz 2026",
    dayLabel: "Pazar",
    timeLabel: "18:00",
    invitationNote:
      "Hayatımızın en anlamlı gününde sevdiklerimizle birlikte olmaktan mutluluk duyarız.",
    // Tören saati geldiğinde geri sayımın yerini alacak mesaj.
    postEventTitle: "Bu Anlamlı Günde Yanımızda Olduğunuz İçin Teşekkür Ederiz",
    postEventNote: "Paylaştığınız güzel anıları yukarıdaki galeriden görebilirsiniz.",
  },

  venue: {
    name: "Kız Evi",
    address: "Pınarbaşı mh. Olgun sk. Hicret apt. SİNCAN/ANKARA",
    // Mekanınızın enlem/boylam (lat/lng) bilgisini Google Maps'te konuma sağ
    // tıklayıp ilk sırada çıkan koordinatlardan alabilirsiniz. Aşağıdaki değer
    // Sincan ilçe merkezine yakın kabaca bir tahmindir, kesin konum için
    // gerçek koordinatlarla değiştirin.
    lat: 39.94638250495682,
    lng: 32.574342775270225,
    // "Yol Tarifi Al" butonu bu linke gider, Google Maps'te açılır.
    mapLink:
      "https://www.google.com/maps/search/39.946375,+32.574360?entry=tts&g_ep=EgoyMDI2MDYyOS4wIPu8ASoASAFQAw%3D%3D&skid=fe08b4f6-1ba4-4b3d-a1c2-f91e3bfb3ccd",
  },

  features: {
    // true yapıldığında misafirlerin fotoğraf yükleyebildiği paylaşımlı galeri
    // bölümü sitede görünür hale gelir. Aktif etmeden önce imgbb anahtarınızı
    // .env.local dosyasına eklemeniz gerekir (bkz. .env.local.example).
    guestUpload: true,

    // true yapıldığında galeri, açık kalan her sekmede otomatik olarak belirli
    // aralıklarla yenilenir (misafirler yeni fotoğrafları anında görür). Bu,
    // JSONBin isteklerinizi hızla tüketir — normalde false bırakıp SADECE
    // tören günü true yapmanız önerilir. false iken galeri yalnızca sayfa
    // açılışında bir kez ve "Galeriyi Yenile" butonuna basınca çekilir.
    autoRefreshGallery: false,
    // Otomatik yenileme açıksa kaç saniyede bir kontrol edileceği.
    autoRefreshIntervalSeconds: 30,
  },

  music: {
    // public/audio klasörüne kendi müzik dosyanızı koyup adını buraya yazabilirsiniz.
    src: "/audio/Yalın-Akşamüstü.mp3",
    title: "Arka Plan Müziği",
  },
};

export type InvitationConfig = typeof invitationConfig;
