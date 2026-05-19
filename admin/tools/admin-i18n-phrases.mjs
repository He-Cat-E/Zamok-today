import { applyAdminLocalizations } from "./admin-i18n-localize.mjs";

/** Phrase-level admin UI copy — one row per concept, columns per locale code. */
const L = [
  "da","de","el","en","es","fi","fr","he","hi","id","it","ja","ms","nl","no","pl","pt","ro","ru","sv","th","tr","uk","vi","zh"
];

function row(en, ...rest) {
  const m = { en };
  let ri = 0;
  for (const code of L) {
    if (code === "en") continue;
    if (rest[ri] != null) m[code] = rest[ri];
    ri += 1;
  }
  return m;
}

/** Same text for every locale (new UI strings until translated). */
function enOnly(en) {
  return row(en, ...L.filter((c) => c !== "en").map(() => en));
}

export const PHRASES = {
  dashboard: row(
    "Dashboard",
    "Kontrolpanel","Dashboard","Dashboard","Panel","Hallintapaneeli","Tableau de bord","לוח בקרה","डैशबोर्ड","Dasbor","Dashboard","ダッシュボード","Papan Pemuka","Dashboard","Dashbord","Panel","Painel","Panou","Панель управления","Instrumentpanel","แดชบอร์ด","Kontrol paneli","Панель","Bảng điều khiển","仪表板"
  ),
  users: row(
    "Users",
    "Brugere","Χρήστες","Users","Usuarios","Käyttäjät","Utilisateurs","משתמשים","उपयोगकर्ता","Pengguna","Utenti","ユーザー","Pengguna","Gebruikers","Brukere","Użytkownicy","Utilizadores","Utilizatori","Пользователи","Användare","ผู้ใช้","Kullanıcılar","Користувачі","Người dùng","用户"
  ),
  admins: row(
    "Admins",
    "Administratorer","Διαχειριστές","Admins","Administradores","Ylläpitäjät","Administrateurs","מנהלים","एडमिन","Admin","Amministratori","管理者","Pentadbir","Beheerders","Administratorer","Administratorzy","Administradores","Administratori","Администраторы","Administratörer","ผู้ดูแล","Yöneticiler","Адміністратори","Quản trị viên","管理员"
  ),
  roles: row(
    "Admin roles",
    "Adminroller","Ρόλοι διαχείρισης","Admin roles","Roles de administración","Ylläpitäjäroolit","Rôles administrateur","תפקידי ניהול","एडमिन भूमिकाएँ","Peran admin","Ruoli amministratore","管理者ロール","Peranan admin","Beheerdersrollen","Administratorroller","Role administratora","Funções de administrador","Roluri administrator","Роли администратора","Administratörsroller","บทบาทผู้ดูแล","Yönetici rolleri","Ролі адміністратора","Vai trò quản trị","管理员角色"
  ),
  transactions: row(
    "Transaction history",
    "Transaktionshistorik","Ιστορικό συναλλαγών","Transaction history","Historial de transacciones","Tapahtumahistoria","Historique des transactions","היסטוריית עסקאות","लेनदेन इतिहास","Riwayat transaksi","Cronologia transazioni","取引履歴","Sejarah transaksi","Transactiegeschiedenis","Transaksjonshistorikk","Historia transakcji","Histórico de transações","Istoric tranzacții","История транзакций","Transaktionshistorik","ประวัติธุรกรรม","İşlem geçmişi","Історія транзакцій","Lịch sử giao dịch","交易记录"
  ),
  collapse: row(
    "Collapse sidebar",
    "Skjul sidepanel","Σύμπτυξη πλαϊνής γραμμής","Collapse sidebar","Contraer barra lateral","Pienennä sivupalkki","Réduire le panneau","כווץ סרגל צד","साइडबार संक्षिप्त करें","Ciutkan bilah sisi","Comprimi barra laterale","サイドバーを折りたたむ","Runtuhkan bar sisi","Zijbalk inklappen","Skjul sidepanel","Zwiń panel boczny","Recolher barra lateral","Restrânge bara laterală","Свернуть боковую панель","Dölj sidofält","ยุบแถบด้านข้าง","Kenar çubuğunu daralt","Згорнути бічну панель","Thu gọn thanh bên","收起侧栏"
  ),
  expand: row(
    "Expand sidebar",
    "Vis sidepanel","Ανάπτυξη πλαϊνής γραμμής","Expand sidebar","Expandir barra lateral","Laajenna sivupalkki","Développer le panneau","הרחב סרגל צד","साइडबार विस्तृत करें","Perluas bilah sisi","Espandi barra laterale","サイドバーを展開","Kembangkan bar sisi","Zijbalk uitklappen","Vis sidepanel","Rozwiń panel boczny","Expandir barra lateral","Extinde bara laterală","Развернуть боковую панель","Visa sidofält","ขยายแถบด้านข้าง","Kenar çubuğunu genişlet","Розгорнути бічну панель","Mở rộng thanh bên","展开侧栏"
  ),
  section: row(
    "Management",
    "Administration","Διαχείριση","Management","Gestión","Hallinta","Gestion","ניהול","प्रबंधन","Manajemen","Gestione","管理","Pengurusan","Beheer","Administrasjon","Zarządzanie","Gestão","Administrare","Управление","Hantering","การจัดการ","Yönetim","Керування","Quản lý","管理"
  ),
  themeLight: row(
    "Light mode",
    "Lys tilstand","Φωτεινή λειτουργία","Light mode","Modo claro","Vaalea tila","Mode clair","מצב בהיר","लाइट मोड","Mode terang","Modalità chiara","ライトモード","Mod cerah","Lichte modus","Lys modus","Tryb jasny","Modo claro","Mod luminos","Светлая тема","Ljust läge","โหมดสว่าง","Açık tema","Світла тема","Chế độ sáng","浅色模式"
  ),
  themeDark: row(
    "Dark mode",
    "Mørk tilstand","Σκοτεινή λειτουργία","Dark mode","Modo oscuro","Tumma tila","Mode sombre","מצב כהה","डार्क मोड","Mode gelap","Modalità scura","ダークモード","Mod gelap","Donkere modus","Mørk modus","Tryb ciemny","Modo escuro","Mod întunecat","Тёмная тема","Mörkt läge","โหมดมืด","Koyu tema","Темна тема","Chế độ tối","深色模式"
  ),
  language: row(
    "Language",
    "Sprog","Γλώσσα","Language","Idioma","Kieli","Langue","שפה","भाषा","Bahasa","Lingua","言語","Bahasa","Taal","Språk","Język","Idioma","Limbă","Язык","Språk","ภาษา","Dil","Мова","Ngôn ngữ","语言"
  ),
  logout: row(
    "Log out",
    "Log ud","Αποσύνδεση","Log out","Cerrar sesión","Kirjaudu ulos","Se déconnecter","התנתקות","लॉग आउट","Keluar","Esci","ログアウト","Log keluar","Uitloggen","Logg ut","Wyloguj się","Sair","Deconectare","Выйти","Logga ut","ออกจากระบบ","Çıkış","Вийти","Đăng xuất","退出登录"
  ),
  profile: row(
    "My profile",
    "Min profil","Το προφίλ μου","My profile","Mi perfil","Oma profiili","Mon profil","הפרופיל שלי","मेरा प्रोफ़ाइल","Profil saya","Il mio profilo","マイプロフィール","Profil saya","Mijn profiel","Min profil","Mój profil","Meu perfil","Profilul meu","Мой профиль","Min profil","โปรไฟล์ของฉัน","Profilim","Мій профіль","Hồ sơ của tôi","我的资料"
  ),
  search: row(
    "Search languages…",
    "Søg sprog…","Αναζήτηση γλωσσών…","Search languages…","Buscar idiomas…","Hae kieliä…","Rechercher une langue…","חיפוש שפות…","भाषाएँ खोजें…","Cari bahasa…","Cerca lingue…","言語を検索…","Cari bahasa…","Talen zoeken…","Søk språk…","Szukaj języka…","Pesquisar idiomas…","Caută limbi…","Поиск языка…","Sök språk…","ค้นหาภาษา…","Dil ara…","Пошук мови…","Tìm ngôn ngữ…","搜索语言…"
  ),
  signIn: row(
    "Sign in",
    "Log ind","Σύνδεση","Sign in","Iniciar sesión","Kirjaudu sisään","Se connecter","התחברות","साइन इन","Masuk","Accedi","サインイン","Log masuk","Inloggen","Logg inn","Zaloguj się","Entrar","Conectare","Войти","Logga in","เข้าสู่ระบบ","Giriş yap","Увійти","Đăng nhập","登录"
  ),
  email: row(
    "Email",
    "E-mail","Email","Email","Correo electrónico","Sähköposti","E-mail","אימייל","ईमेल","Email","Email","メール","E-mel","E-mail","E-post","E-mail","E-mail","E-mail","Эл. почта","E-post","อีเมล","E-posta","Електронна пошта","Email","电子邮件"
  ),
  password: row(
    "Password",
    "Adgangskode","Κωδικός πρόσβασης","Password","Contraseña","Salasana","Mot de passe","סיסמה","पासवर्ड","Kata sandi","Password","パスワード","Kata laluan","Wachtwoord","Passord","Hasło","Senha","Parolă","Пароль","Lösenord","รหัสผ่าน","Şifre","Пароль","Mật khẩu","密码"
  ),
  pleaseWait: row(
    "Please wait…",
    "Vent venligst…","Περιμένετε…","Please wait…","Espere…","Odota…","Veuillez patienter…","המתן…","कृपया प्रतीक्षा करें…","Harap tunggu…","Attendere…","お待ちください…","Sila tunggu…","Even geduld…","Vennligst vent…","Proszę czekać…","Aguarde…","Așteptați…","Подождите…","Vänta…","โปรดรอ…","Lütfen bekleyin…","Зачекайте…","Vui lòng đợi…","请稍候…"
  ),
  dashboardSubtitle: row(
    "Overview of your admin workspace.",
    "Overblik over dit admin-arbejdsområde.","Επισκόπηση του χώρου διαχείρισης.","Overview of your admin workspace.","Resumen de su espacio de administración.","Yleiskatsaus hallintatyötilaan.","Aperçu de votre espace d'administration.","סקירה של סביבת הניהול.","आपके एडमिन कार्यक्षेत्र का अवलोकन।","Ikhtisar ruang kerja admin Anda.","Panoramica dell'area di amministrazione.","管理ワークスペースの概要。","Gambaran ruang kerja pentadbir anda.","Overzicht van uw beheeromgeving.","Oversikt over admin-arbeidsområdet.","Przegląd panelu administracyjnego.","Visão geral do seu espaço de administração.","Prezentare generală a spațiului de administrare.","Обзор рабочей области администратора.","Översikt av din admin-yta.","ภาพรวมพื้นที่ทำงานผู้ดูแลของคุณ","Yönetim alanınıza genel bakış.","Огляд робочого простору адміністратора.","Tổng quan không gian quản trị của bạn.","管理后台概览。"
  ),
  welcomeBack: row(
    "Welcome back",
    "Velkommen tilbage","Καλώς ήρθατε ξανά","Welcome back","Bienvenido de nuevo","Tervetuloa takaisin","Bon retour","ברוך שובך","वापसी पर स्वागत है","Selamat datang kembali","Bentornato","おかえりなさい","Selamat kembali","Welkom terug","Velkommen tilbake","Witamy ponownie","Bem-vindo de volta","Bine ai revenit","С возвращением","Välkommen tillbaka","ยินดีต้อนรับกลับ","Tekrar hoş geldiniz","З поверненням","Chào mừng trở lại","欢迎回来"
  ),
  role: row(
    "Role",
    "Rolle","Ρόλος","Role","Rol","Rooli","Rôle","תפקיד","भूमिका","Peran","Ruolo","役割","Peranan","Rol","Rolle","Rola","Função","Rol","Роль","Roll","บทบาท","Rol","Роль","Vai trò","角色"
  ),
  account: row(
    "Account",
    "Konto","Λογαριασμός","Account","Cuenta","Tili","Compte","חשבון","खाता","Akun","Account","アカウント","Akaun","Account","Konto","Konto","Conta","Cont","Аккаунт","Konto","บัญชี","Hesap","Обліковий запис","Tài khoản","账户"
  ),
  status: row(
    "Status",
    "Status","Κατάσταση","Status","Estado","Tila","Statut","סטטוס","स्थिति","Status","Stato","ステータス","Status","Status","Status","Status","Estado","Stare","Статус","Status","สถานะ","Durum","Статус","Trạng thái","状态"
  ),
  active: row(
    "Active",
    "Aktiv","Ενεργό","Active","Activo","Aktiivinen","Actif","פעיל","सक्रिय","Aktif","Attivo","有効","Aktif","Actief","Aktiv","Aktywny","Ativo","Activ","Активен","Aktiv","ใช้งานอยู่","Aktif","Активний","Đang hoạt động","活跃"
  ),
  usersTitle: row(
    "Users management",
    "Brugeradministration","Διαχείριση χρηστών","Users management","Gestión de usuarios","Käyttäjähallinta","Gestion des utilisateurs","ניהול משתמשים","उपयोगकर्ता प्रबंधन","Manajemen pengguna","Gestione utenti","ユーザー管理","Pengurusan pengguna","Gebruikersbeheer","Brukeradministrasjon","Zarządzanie użytkownikami","Gestão de utilizadores","Gestionare utilizatori","Управление пользователями","Användarhantering","การจัดการผู้ใช้","Kullanıcı yönetimi","Керування користувачами","Quản lý người dùng","用户管理"
  ),
  usersSubtitle: row(
    "View and manage registered customer accounts.",
    "Se og administrer registrerede kundekonti.","Προβολή και διαχείριση εγγεγραμμένων λογαριασμών.","View and manage registered customer accounts.","Ver y gestionar cuentas de clientes registradas.","Tarkastele ja hallitse rekisteröityjä asiakastilejä.","Afficher et gérer les comptes clients enregistrés.","צפייה וניהול של חשבונות לקוחות רשומים.","पंजीकृत ग्राहक खाते देखें और प्रबंधित करें।","Lihat dan kelola akun pelanggan terdaftar.","Visualizza e gestisci gli account clienti registrati.","登録済みの顧客アカウントを表示・管理します。","Lihat dan urus akaun pelanggan berdaftar.","Bekijk en beheer geregistreerde klantaccounts.","Se og administrer registrerte kundekontoer.","Przeglądaj i zarządzaj zarejestrowanymi kontami klientów.","Ver e gerir contas de clientes registadas.","Vizualizați și gestionați conturile clienților înregistrați.","Просмотр и управление зарегистрированными учётными записями.","Visa och hantera registrerade kundkonton.","ดูและจัดการบัญชีลูกค้าที่ลงทะเบียน","Kayıtlı müşteri hesaplarını görüntüleyin ve yönetin.","Перегляд і керування зареєстрованими обліковими записами.","Xem và quản lý tài khoản khách hàng đã đăng ký.","查看和管理已注册的客户账户。"
  ),
  usersPlaceholder: row(
    "User list and actions will be connected to the API soon.",
    "Brugerliste og handlinger kobles snart til API'et.","Η λίστα χρηστών θα συνδεθεί σύντομα με το API.","User list and actions will be connected to the API soon.","La lista de usuarios se conectará pronto a la API.","Käyttäjälista yhdistetään pian API:in.","La liste des utilisateurs sera bientôt connectée à l'API.","רשימת המשתמשים תתחבר בקרוב ל-API.","उपयोगकर्ता सूची जल्द ही API से जुड़ेगी।","Daftar pengguna akan segera terhubung ke API.","L'elenco utenti sarà presto collegato all'API.","ユーザー一覧はまもなく API に接続されます。","Senarai pengguna akan disambungkan ke API tidak lama lagi.","Gebruikerslijst wordt binnenkort aan de API gekoppeld.","Brukerlisten kobles snart til API-et.","Lista użytkowników wkrótce połączy się z API.","A lista de utilizadores será ligada à API em breve.","Lista de utilizatori va fi conectată în curând la API.","Список пользователей скоро будет подключён к API.","Användarlistan kopplas snart till API:et.","รายการผู้ใช้จะเชื่อมต่อกับ API เร็วๆ นี้","Kullanıcı listesi yakında API'ye bağlanacak.","Список користувачів незабаром підключать до API.","Danh sách người dùng sẽ sớm kết nối với API.","用户列表即将接入 API。"
  ),
  adminsTitle: row(
    "Admin management",
    "Administratorstyring","Διαχείριση διαχειριστών","Admin management","Gestión de administradores","Ylläpitäjähallinta","Gestion des administrateurs","ניהול מנהלים","एडमिन प्रबंधन","Manajemen admin","Gestione amministratori","管理者管理","Pengurusan pentadbir","Beheerdersbeheer","Administratoradministrasjon","Zarządzanie administratorami","Gestão de administradores","Gestionare administratori","Управление администраторами","Administratörshantering","การจัดการผู้ดูแล","Yönetici yönetimi","Керування адміністраторами","Quản lý quản trị viên","管理员管理"
  ),
  adminsSubtitle: row(
    "Manage administrator accounts and access.",
    "Administrer administrator-konti og adgang.","Διαχείριση λογαριασμών και πρόσβασης διαχειριστών.","Manage administrator accounts and access.","Gestione cuentas de administrador y acceso.","Hallitse ylläpitäjätilejä ja käyttöoikeuksia.","Gérer les comptes administrateur et les accès.","ניהול חשבונות מנהל והרשאות.","प्रशासक खाते और पहुंच प्रबंधित करें।","Kelola akun dan akses administrator.","Gestisci account amministratore e accessi.","管理者アカウントとアクセスを管理します。","Urus akaun pentadbir dan akses.","Beheer beheerdersaccounts en toegang.","Administrer administrator-kontoer og tilgang.","Zarządzaj kontami administratorów i dostępem.","Gerir contas de administrador e acessos.","Gestionați conturile de administrator și accesul.","Управление учётными записями и доступом администраторов.","Hantera administratörskonton och åtkomst.","จัดการบัญชีและสิทธิ์ผู้ดูแล","Yönetici hesaplarını ve erişimi yönetin.","Керуйте обліковими записами та доступом адміністраторів.","Quản lý tài khoản và quyền quản trị.","管理管理员账户和权限。"
  ),
  adminsPlaceholder: row(
    "Admin list and invite flows will be added here.",
    "Administratorliste og invitationer tilføjes her.","Η λίστα διαχειριστών θα προστεθεί εδώ.","Admin list and invite flows will be added here.","La lista de administradores se añadirá aquí.","Ylläpitäjälista ja kutsut lisätään tähän.","La liste des administrateurs sera ajoutée ici.","רשימת המנהלים והזמנות יתווספו כאן.","एडमिन सूची और आमंत्रण यहाँ जोड़े जाएंगे।","Daftar admin dan alur undangan akan ditambahkan di sini.","Elenco admin e inviti saranno aggiunti qui.","管理者リストと招待フローはここに追加されます。","Senarai pentadbir dan jemputan akan ditambah di sini.","Beheerderslijst en uitnodigingen komen hier.","Administratorliste og invitasjoner legges til her.","Lista administratorów i zaproszenia pojawią się tutaj.","Lista de administradores e convites serão adicionados aqui.","Lista de administratori și invitațiile vor fi adăugate aici.","Список администраторов и приглашения появятся здесь.","Adminlista och inbjudningar läggs till här.","รายการผู้ดูแลและการเชิญจะเพิ่มที่นี่","Yönetici listesi ve davet akışları buraya eklenecek.","Список адміністраторів і запрошення з’являться тут.","Danh sách quản trị và lời mời sẽ được thêm tại đây.","管理员列表和邀请流程将添加在此处。"
  ),
  rolesTitle: row(
    "Admin role management",
    "Adminrollestyring","Διαχείριση ρόλων διαχείρισης","Admin role management","Gestión de roles de administración","Ylläpitäjäroolien hallinta","Gestion des rôles administrateur","ניהול תפקידי מנהל","एडमिन भूमिका प्रबंधन","Manajemen peran admin","Gestione ruoli amministratore","管理者ロール管理","Pengurusan peranan pentadbir","Beheer van beheerdersrollen","Rolleadministrasjon","Zarządzanie rolami administratora","Gestão de funções de administrador","Gestionare roluri administrator","Управление ролями администратора","Hantering av administratörsroller","การจัดการบทบาทผู้ดูแล","Yönetici rol yönetimi","Керування ролями адміністратора","Quản lý vai trò quản trị","管理员角色管理"
  ),
  rolesSubtitle: row(
    "Define roles and permissions for the admin panel.",
    "Definer roller og tilladelser til admin-panelet.","Ορίστε ρόλους και δικαιώματα για το πάνελ διαχείρισης.","Define roles and permissions for the admin panel.","Defina roles y permisos del panel de administración.","Määritä roolit ja oikeudet hallintapaneeliin.","Définir les rôles et permissions du panneau d'administration.","הגדרת תפקידים והרשאות לפאנל הניהול.","एडमिन पैनल के लिए भूमिकाएँ और अनुमतियाँ परिभाषित करें।","Tetapkan peran dan izin untuk panel admin.","Definisci ruoli e permessi per il pannello admin.","管理パネルのロールと権限を定義します。","Tetapkan peranan dan kebenaran untuk panel pentadbir.","Definieer rollen en rechten voor het beheerpaneel.","Definer roller og tillatelser for admin-panelet.","Zdefiniuj role i uprawnienia panelu administracyjnego.","Defina funções e permissões do painel de administração.","Definiți rolurile și permisiunile panoului de administrare.","Определите роли и права для панели администратора.","Definiera roller och behörigheter för adminpanelen.","กำหนดบทบาทและสิทธิ์สำหรับแผงผู้ดูแล","Yönetim paneli için roller ve izinler tanımlayın.","Визначте ролі та дозволи для панелі адміністратора.","Xác định vai trò và quyền cho bảng quản trị.","为管理面板定义角色和权限。"
  ),
  rolesPlaceholder: row(
    "Role definitions (super admin, admin, etc.) will be configured here.",
    "Rolledefinitioner (super admin osv.) konfigureres her.","Οι ορισμοί ρόλων (super admin κ.λπ.) θα ρυθμιστούν εδώ.","Role definitions (super admin, admin, etc.) will be configured here.","Las definiciones de roles se configurarán aquí.","Roolimäärittelyt (super admin jne.) määritetään tähän.","Les définitions de rôles seront configurées ici.","הגדרות תפקידים (מנהל על וכו') יוגדרו כאן.","भूमिका परिभाषाएँ (सुपर एडमिन आदि) यहाँ कॉन्फ़िगर होंगी।","Definisi peran (super admin, dll.) akan dikonfigurasi di sini.","Le definizioni dei ruoli saranno configurate qui.","ロール定義（スーパー管理者など）はここで設定します。","Takrifan peranan akan dikonfigurasi di sini.","Roldefinities worden hier geconfigureerd.","Rolledefinisjoner konfigureres her.","Definicje ról zostaną skonfigurowane tutaj.","Definições de funções serão configuradas aqui.","Definițiile rolurilor vor fi configurate aici.","Определения ролей будут настроены здесь.","Rolldefinitioner konfigureras här.","คำจำกัดความบทบาทจะกำหนดที่นี่","Rol tanımları (süper yönetici vb.) burada yapılandırılacak.","Визначення ролей будуть налаштовані тут.","Định nghĩa vai trò sẽ được cấu hình tại đây.","角色定义将在此处配置。"
  ),
  transactionsTitle: row(
    "Transaction history",
    "Transaktionshistorik","Ιστορικό συναλλαγών","Transaction history","Historial de transacciones","Tapahtumahistoria","Historique des transactions","היסטוריית עסקאות","लेनदेन इतिहास","Riwayat transaksi","Cronologia transazioni","取引履歴","Sejarah transaksi","Transactiegeschiedenis","Transaksjonshistorikk","Historia transakcji","Histórico de transações","Istoric tranzacții","История транзакций","Transaktionshistorik","ประวัติธุรกรรม","İşlem geçmişi","Історія транзакцій","Lịch sử giao dịch","交易记录"
  ),
  transactionsSubtitle: row(
    "Wallet top-ups and payment activity across users.",
    "Pung optankninger og betalinger på tværs af brugere.","Συναλλαγές πορτοφολιού και πληρωμών ανά χρήστη.","Wallet top-ups and payment activity across users.","Recargas de monedero y pagos de usuarios.","Lompakkolataukset ja maksut käyttäjittäin.","Recharges de portefeuille et paiements par utilisateur.","טעינות ארנק ופעילות תשלום לפי משתמש.","उपयोगकर्ताओं में वॉलेट टॉप-अप और भुगतान गतिविधि।","Isi ulang dompet dan aktivitas pembayaran pengguna.","Ricariche portafoglio e pagamenti per utente.","ユーザーごとのウォレットチャージと支払い。","Tambah nilai dompet dan aktiviti pembayaran pengguna.","Portemonnee-opwaarderingen en betalingen per gebruiker.","Lommebokpåfylling og betalinger per bruker.","Doładowania portfela i płatności użytkowników.","Carregamentos de carteira e pagamentos por utilizador.","Reîncărcări portofel și plăți per utilizator.","Пополнения кошелька и платежи пользователей.","Plånboksfyllningar och betalningar per användare.","การเติมเงินในกระเป๋าและการชำระเงินของผู้ใช้","Cüzdan yüklemeleri ve kullanıcı ödeme hareketleri.","Поповнення гаманця та платежі користувачів.","Nạp ví và hoạt động thanh toán theo người dùng.","用户钱包充值和支付活动。"
  ),
  transactionsPlaceholder: row(
    "Transaction table will load from /api/admin when endpoints are ready.",
    "Transaktionstabel indlæses fra /api/admin når API er klar.","Ο πίνακας συναλλαγών θα φορτωθεί από /api/admin.","Transaction table will load from /api/admin when endpoints are ready.","La tabla de transacciones se cargará desde /api/admin.","Tapahtumataulukko ladataan /api/administa.","Le tableau des transactions sera chargé depuis /api/admin.","טבלת העסקאות תיטען מ-/api/admin.","लेनदेन तालिका /api/admin से लोड होगी।","Tabel transaksi akan dimuat dari /api/admin.","La tabella transazioni verrà caricata da /api/admin.","取引テーブルは /api/admin から読み込まれます。","Jadual transaksi akan dimuatkan dari /api/admin.","Transactietabel wordt geladen vanuit /api/admin.","Transaksjonstabell lastes fra /api/admin.","Tabela transakcji załaduje się z /api/admin.","A tabela de transações carregará de /api/admin.","Tabelul tranzacțiilor se va încărca din /api/admin.","Таблица транзакций загрузится из /api/admin.","Transaktionstabellen laddas från /api/admin.","ตารางธุรกรรมจะโหลดจาก /api/admin","İşlem tablosu /api/admin hazır olduğunda yüklenecek.","Таблицю транзакцій завантажать з /api/admin.","Bảng giao dịch sẽ tải từ /api/admin.","交易表将从 /api/admin 加载。"
  ),
  comingSoon: row(
    "Coming soon",
    "Kommer snart","Σύντομα διαθέσιμο","Coming soon","Próximamente","Tulossa pian","Bientôt disponible","בקרוב","जल्द आ रहा है","Segera hadir","In arrivo","近日公開","Akan datang","Binnenkort","Kommer snart","Wkrótce","Em breve","În curând","Скоро","Kommer snart","เร็วๆ นี้","Yakında","Незабаром","Sắp có","即将推出"
  ),
  id: row("ID","ID","ID","ID","ID","ID","ID","מזהה","आईडी","ID","ID","ID","ID","ID","ID","ID","ID","ID","ID","ID","รหัส","ID","ID","ID","ID"),
  name: row(
    "Name",
    "Navn","Όνομα","Name","Nombre","Nimi","Nom","שם","नाम","Nama","Nome","名前","Nama","Naam","Navn","Nazwa","Nome","Nume","Имя","Namn","ชื่อ","Ad","Ім'я","Tên","名称"
  ),
  date: row(
    "Date",
    "Dato","Ημερομηνία","Date","Fecha","Päivämäärä","Date","תאריך","तारीख","Tanggal","Data","日付","Tarikh","Datum","Dato","Data","Data","Dată","Дата","Datum","วันที่","Tarih","Дата","Ngày","日期"
  ),
  amount: row(
    "Amount",
    "Beløb","Ποσό","Amount","Importe","Summa","Montant","סכום","राशि","Jumlah","Importo","金額","Jumlah","Bedrag","Beløp","Kwota","Valor","Sumă","Сумма","Belopp","จำนวน","Tutar","Сума","Số tiền","金额"
  ),
  phone: enOnly("Phone"),
  authMethod: enOnly("Sign-in method"),
  registered: enOnly("Registered"),
  tableType: enOnly("Type"),
  tableDescription: enOnly("Description"),
  txTypeTopUp: enOnly("Top-up"),
  txTypePayment: enOnly("Payment"),
  txTypeRefund: enOnly("Refund"),
  txStatusCompleted: enOnly("Completed"),
  txStatusFailed: enOnly("Failed"),
  txStatusPending: enOnly("Pending"),
  transactionsTableEmpty: enOnly("No transactions yet."),
  transactionsTableNoResults: enOnly("No matching transactions."),
  transactionsTableInfo: enOnly("Showing _START_ to _END_ of _TOTAL_ transactions"),
  transactionsTableInfoEmpty: enOnly("No transactions to show"),
  transactionsTableInfoFiltered: enOnly("(filtered from _MAX_ total)"),
  transactionsTableSearch: enOnly("Search transactions…"),
  transactionsTableLengthMenu: enOnly("Show _MENU_ transactions"),
  transactionsTableProcessing: enOnly("Loading transactions…"),
  transactionsPeriod: enOnly("Period"),
  transactionsDateFrom: enOnly("From"),
  transactionsDateTo: enOnly("To"),
  transactionsPeriodApply: enOnly("Apply"),
  transactionsPeriodClear: enOnly("Clear"),
  transactionsPeriodPlaceholder: enOnly("Select date range"),
  authMethodPhone: enOnly("Phone (SMS)"),
  authMethodEmail: enOnly("Email"),
  statusVerified: enOnly("Verified"),
  statusUnverified: enOnly("Unverified"),
  usersTableEmpty: enOnly("No users yet."),
  usersTableNoResults: enOnly("No matching users."),
  usersTableInfo: enOnly("Showing _START_ to _END_ of _TOTAL_ users"),
  usersTableInfoEmpty: enOnly("No users to show"),
  usersTableInfoFiltered: enOnly("(filtered from _MAX_ total)"),
  usersTableSearch: enOnly("Search users…"),
  usersTableLengthMenu: enOnly("Show _MENU_ users"),
  usersTableProcessing: enOnly("Loading users…"),
  usersTableLoadError: enOnly("Could not load users."),
  accountStatusLabel: enOnly("Account"),
  verificationLabel: enOnly("Verification"),
  accountStatusActive: enOnly("Active"),
  accountStatusSuspended: enOnly("Suspended"),
  viewWallet: enOnly("Wallet"),
  suspendAccount: enOnly("Suspend"),
  unsuspendAccount: enOnly("Activate"),
  suspendTitle: enOnly("Suspend account"),
  suspendConfirm: enOnly("Suspend account for {name}? They will not be able to sign in."),
  cancel: enOnly("Cancel"),
  statusUpdated: enOnly("Account status updated."),
  statusError: enOnly("Could not update account status."),
  walletTitle: enOnly("Wallet"),
  walletBalance: enOnly("Balance"),
  walletRecentTx: enOnly("Recent transactions"),
  walletNoTx: enOnly("No transactions yet."),
  walletLoading: enOnly("Loading wallet…"),
  walletLoadError: enOnly("Could not load wallet."),
  walletClose: enOnly("Close"),
  adminsRoleSuper: enOnly("Super admin"),
  adminsRoleAdmin: enOnly("Administrator"),
  adminsPagesCol: enOnly("Page access"),
  adminsCreateAdmin: enOnly("Create administrator"),
  adminsEdit: enOnly("Edit"),
  adminsCreate: enOnly("Create"),
  adminsSave: enOnly("Save changes"),
  adminsFormCreateTitle: enOnly("New administrator"),
  adminsFormEditTitle: enOnly("Edit administrator"),
  adminsFormPages: enOnly("Accessible pages"),
  adminsFormPasswordHint: enOnly("At least 8 characters."),
  adminsFormSelectPage: enOnly("Select at least one page."),
  adminsSuspendTitle: enOnly("Suspend administrator"),
  adminsSuspendConfirm: enOnly("Suspend {name}? They will not be able to sign in."),
  adminsTableEmpty: enOnly("No administrators yet."),
  adminsTableNoResults: enOnly("No matching administrators."),
  adminsTableInfo: enOnly("Showing _START_ to _END_ of _TOTAL_ administrators"),
  adminsTableInfoEmpty: enOnly("No administrators to show"),
  adminsTableInfoFiltered: enOnly("(filtered from _MAX_ total)"),
  adminsTableSearch: enOnly("Search administrators…"),
  adminsTableLengthMenu: enOnly("Show _MENU_"),
  adminsTableProcessing: enOnly("Loading administrators…"),
  adminsTableSelf: enOnly("You"),
  profileAccountSection: enOnly("Account details"),
  profileAccountHint: enOnly("Your email and role are managed by an administrator."),
  profileSaveProfile: enOnly("Save name"),
  profileSaved: enOnly("Profile updated."),
  profileSaveError: enOnly("Could not update profile."),
  profilePasswordSection: enOnly("Change password"),
  profilePasswordHint: enOnly("Use a strong password with at least 8 characters."),
  profileCurrentPassword: enOnly("Current password"),
  profileNewPassword: enOnly("New password"),
  profileConfirmPassword: enOnly("Confirm new password"),
  profileChangePassword: enOnly("Update password"),
  profilePasswordSaved: enOnly("Password updated."),
  profilePasswordError: enOnly("Could not change password."),
  profileTabGeneral: enOnly("General"),
  profileTabSecurity: enOnly("Security"),
  profileMemberSince: enOnly("Administrator account"),
  actions: row(
    "Actions",
    "Handlinger","Ενέργειες","Actions","Acciones","Toiminnot","Actions","פעולות","कार्रवाई","Tindakan","Azioni","操作","Tindakan","Acties","Handlinger","Akcje","Ações","Acțiuni","Действия","Åtgärder","การดำเนินการ","İşlemler","Дії","Thao tác","操作"
  ),
  profileTitle: row(
    "My profile",
    "Min profil","Το προφίλ μου","My profile","Mi perfil","Oma profiili","Mon profil","הפרופיל שלי","मेरा प्रोफ़ाइल","Profil saya","Il mio profilo","マイプロフィール","Profil saya","Mijn profiel","Min profil","Mój profil","Meu perfil","Profilul meu","Мой профиль","Min profil","โปรไฟล์ของฉัน","Profilim","Мій профіль","Hồ sơ của tôi","我的资料"
  ),
  profileSubtitle: row(
    "Your administrator account details.",
    "Detaljer for din administratorkonto.","Στοιχεία λογαριασμού διαχειριστή.","Your administrator account details.","Detalles de su cuenta de administrador.","Ylläpitäjätilisi tiedot.","Détails de votre compte administrateur.","פרטי חשבון המנהל שלך.","आपके व्यवस्थापक खाते का विवरण।","Detail akun administrator Anda.","Dettagli del tuo account amministratore.","管理者アカウントの詳細。","Butiran akaun pentadbir anda.","Gegevens van uw beheerdersaccount.","Detaljer for administratorkontoen din.","Szczegóły konta administratora.","Detalhes da sua conta de administrador.","Detaliile contului de administrator.","Данные учётной записи администратора.","Uppgifter för ditt administratörskonto.","รายละเอียดบัญชีผู้ดูแลของคุณ","Yönetici hesap bilgileriniz.","Дані облікового запису адміністратора.","Chi tiết tài khoản quản trị của bạn.","您的管理员账户信息。"
  ),
  fullName: row(
    "Full name",
    "Fulde navn","Πλήρες όνομα","Full name","Nombre completo","Koko nimi","Nom complet","שם מלא","पूरा नाम","Nama lengkap","Nome completo","氏名","Nama penuh","Volledige naam","Fullt navn","Imię i nazwisko","Nome completo","Nume complet","Полное имя","Fullständigt namn","ชื่อ-นามสกุล","Ad soyad","Повне ім'я","Họ và tên","全名"
  ),
  adminBadge: row(
    "Admin",
    "Admin","Διαχείριση","Admin","Admin","Admin","Admin","ניהול","एडमिन","Admin","Admin","管理","Admin","Admin","Admin","Admin","Admin","Admin","Админ","Admin","ผู้ดูแล","Admin","Адмін","Quản trị","管理"
  ),
  brandSub: row(
    "Admin Dashboard",
    "Admin-dashboard","Πίνακας διαχείρισης","Admin Dashboard","Panel de administración","Ylläpitäjän hallintapaneeli","Tableau de bord admin","לוח בקרה למנהל","एडमिन डैशबोर्ड","Dasbor Admin","Dashboard amministratore","管理ダッシュボード","Papan Pemuka Admin","Beheerdersdashboard","Admin-dashbord","Panel administracyjny","Painel de administração","Panou de administrare","Панель администратора","Admin-instrumentpanel","แดชบอร์ดผู้ดูแล","Yönetici paneli","Панель адміністратора","Bảng quản trị","管理后台"
  ),
  notifications: row(
    "Notifications",
    "Notifikationer","Ειδοποιήσεις","Notifications","Notificaciones","Ilmoitukset","Notifications","התראות","सूचनाएँ","Notifikasi","Notifiche","通知","Pemberitahuan","Meldingen","Varsler","Powiadomienia","Notificações","Notificări","Уведомления","Aviseringar","การแจ้งเตือน","Bildirimler","Сповіщення","Thông báo","通知"
  ),
  notificationsEmpty: row(
    "No notifications yet.",
    "Ingen notifikationer endnu.","Δεν υπάρχουν ειδοποιήσεις.","No notifications yet.","Aún no hay notificaciones.","Ei ilmoituksia vielä.","Aucune notification pour le moment.","אין התראות עדיין.","अभी कोई सूचना नहीं।","Belum ada notifikasi.","Nessuna notifica.","通知はまだありません。","Tiada pemberitahuan lagi.","Nog geen meldingen.","Ingen varsler ennå.","Brak powiadomień.","Ainda sem notificações.","Nicio notificare încă.","Уведомлений пока нет.","Inga aviseringar än.","ยังไม่มีการแจ้งเตือน","Henüz bildirim yok.","Сповіщень ще немає.","Chưa có thông báo.","暂无通知。"
  ),
  markAllRead: row(
    "Mark all as read",
    "Markér alle som læst","Σήμανση όλων ως αναγνωσμένων","Mark all as read","Marcar todo como leído","Merkitse kaikki luetuiksi","Tout marquer comme lu","סמן הכל כנקרא","सभी को पढ़ा हुआ चिह्नित करें","Tandai semua sudah dibaca","Segna tutto come letto","すべて既読にする","Tandai semua dibaca","Alles als gelezen markeren","Merk alle som lest","Oznacz wszystkie jako przeczytane","Marcar tudo como lido","Marchează tot ca citit","Отметить все как прочитанные","Markera alla som lästa","ทำเครื่องหมายว่าอ่านแล้วทั้งหมด","Tümünü okundu işaretle","Позначити все прочитаним","Đánh dấu tất cả đã đọc","全部标为已读"
  ),
  notifDemo1Title: row(
    "New user registration",
    "Ny brugerregistrering","Νέα εγγραφή χρήστη","New user registration","Nuevo registro de usuario","Uusi käyttäjärekisteröityminen","Nouvelle inscription","הרשמת משתמש חדש","नया उपयोगकर्ता पंजीकरण","Pendaftaran pengguna baru","Nuova registrazione utente","新規ユーザー登録","Pendaftaran pengguna baharu","Nieuwe gebruikersregistratie","Ny brukerregistrering","Nowa rejestracja użytkownika","Novo registo de utilizador","Înregistrare utilizator nouă","Новая регистрация","Ny användarregistrering","มีการลงทะเบียนผู้ใช้ใหม่","Yeni kullanıcı kaydı","Нова реєстрація","Đăng ký người dùng mới","新用户注册"
  ),
  notifDemo1Body: row(
    "A customer account was created on the platform.",
    "En kundekonto blev oprettet på platformen.","Δημιουργήθηκε λογαριασμός πελάτη.","A customer account was created on the platform.","Se creó una cuenta de cliente en la plataforma.","Asiakastili luotiin alustalle.","Un compte client a été créé sur la plateforme.","נוצר חשבון לקוח בפלטפורמה.","प्लेटफ़ॉर्म पर ग्राहक खाता बनाया गया।","Akun pelanggan dibuat di platform.","È stato creato un account cliente sulla piattaforma.","プラットフォームで顧客アカウントが作成されました。","Akaun pelanggan dicipta di platform.","Er is een klantaccount aangemaakt.","En kundekonto ble opprettet.","Utworzono konto klienta na platformie.","Foi criada uma conta de cliente na plataforma.","A fost creat un cont de client pe platformă.","На платформе создан аккаунт клиента.","Ett kundkonto skapades på plattformen.","มีการสร้างบัญชีลูกค้าบนแพลตฟอร์ม","Platformda bir müşteri hesabı oluşturuldu.","На платформі створено обліковий запис клієнта.","Tài khoản khách hàng đã được tạo.","平台上创建了客户账户。"
  ),
  notifDemo2Title: row(
    "Wallet top-up completed",
    "Pung optankning gennemført","Ολοκληρώθηκε φόρτιση πορτοφολιού","Wallet top-up completed","Recarga de monedero completada","Lompakon lataus valmis","Recharge du portefeuille effectuée","טעינת ארנק הושלמה","वॉलेट टॉप-अप पूर्ण","Isi ulang dompet selesai","Ricarica portafoglio completata","ウォレットチャージ完了","Tambah nilai dompet selesai","Portemonnee-opwaardering voltooid","Lommebokpåfylling fullført","Doładowanie portfela zakończone","Carregamento de carteira concluído","Reîncărcare portofel finalizată","Пополнение кошелька завершено","Plånboksfyllning slutförd","เติมเงินในกระเป๋าเสร็จสิ้น","Cüzdan yüklemesi tamamlandı","Поповнення гаманця завершено","Nạp ví hoàn tất","钱包充值完成"
  ),
  notifDemo2Body: row(
    "Payment confirmed for a recent transaction.",
    "Betaling bekræftet for en nylig transaktion.","Η πληρωμή επιβεβαιώθηκε για πρόσφατη συναλλαγή.","Payment confirmed for a recent transaction.","Pago confirmado para una transacción reciente.","Maksu vahvistettu viimeiselle tapahtumalle.","Paiement confirmé pour une transaction récente.","התשלום אושר לעסקה אחרונה.","हाल की लेनदेन के लिए भुगतान की पुष्टि।","Pembayaran dikonfirmasi untuk transaksi terbaru.","Pagamento confermato per una transazione recente.","最近の取引の支払いが確認されました。","Bayaran disahkan untuk transaksi terkini.","Betaling bevestigd voor recente transactie.","Betaling bekreftet for nylig transaksjon.","Płatność potwierdzona dla ostatniej transakcji.","Pagamento confirmado para transação recente.","Plată confirmată pentru o tranzacție recentă.","Платёж подтверждён для недавней транзакции.","Betalning bekräftad för senaste transaktionen.","ยืนยันการชำระเงินสำหรับธุรกรรมล่าสุด","Son işlem için ödeme onaylandı.","Платіж підтверджено для останньої транзакції.","Đã xác nhận thanh toán cho giao dịch gần đây.","最近一笔交易的付款已确认。"
  ),
  timeAgo2h: row(
    "2 hours ago",
    "for 2 timer siden","πριν από 2 ώρες","2 hours ago","hace 2 horas","2 tuntia sitten","il y a 2 heures","לפני שעתיים","2 घंटे पहले","2 jam yang lalu","2 ore fa","2時間前","2 jam lalu","2 uur geleden","for 2 timer siden","2 godziny temu","há 2 horas","acum 2 ore","2 часа назад","för 2 timmar sedan","2 ชั่วโมงที่แล้ว","2 saat önce","2 години тому","2 giờ trước","2 小时前"
  ),
  hotkeyOpening: row(
    "Opening",
    "Åbner","Άνοιγμα","Opening","Abriendo","Avataan","Ouverture","פתיחה","खोल रहे हैं","Membuka","Apertura","開いています","Membuka","Openen","Åpner","Otwieranie","A abrir","Deschidere","Открытие","Öppnar","กำลังเปิด","Açılıyor","Відкриття","Đang mở","正在打开"
  ),
  hotkeyDismiss: row(
    "Dismiss",
    "Luk","Απόρριψη","Dismiss","Cerrar","Sulje","Fermer","סגור","बंद करें","Tutup","Chiudi","閉じる","Tutup","Sluiten","Lukk","Zamknij","Fechar","Închide","Закрыть","Stäng","ปิด","Kapat","Закрити","Đóng","关闭"
  ),
  loginSubtitle: row(
    "Sign in to the admin dashboard",
    "Log ind på admin-dashboardet","Σύνδεση στον πίνακα διαχείρισης","Sign in to the admin dashboard","Inicia sesión en el panel de administración","Kirjaudu hallintapaneeliin","Connectez-vous au tableau de bord admin","התחברות ללוח הבקרה","एडमिन डैशबोर्ड में साइन इन करें","Masuk ke dasbor admin","Accedi alla dashboard admin","管理ダッシュボードにサインイン","Log masuk ke papan pemuka admin","Log in op het beheerdersdashboard","Logg inn på admin-dashbordet","Zaloguj się do panelu administracyjnego","Inicie sessão no painel de administração","Conectați-vă la panoul de administrare","Войдите в панель администратора","Logga in på admin-instrumentpanelen","เข้าสู่ระบบแดชบอร์ดผู้ดูแล","Yönetici paneline giriş yapın","Увійдіть до панелі адміністратора","Đăng nhập bảng quản trị","登录管理后台"
  ),
  loginEmailLabel: row(
    "Please enter your email",
    "Indtast din e-mail","Εισαγάγετε το email σας","Please enter your email","Introduce tu correo electrónico","Anna sähköpostisi","Veuillez saisir votre e-mail","הזינו את האימייל שלכם","कृपया अपना ईमेल दर्ज करें","Masukkan email Anda","Inserisci la tua email","メールアドレスを入力してください","Sila masukkan e-mel anda","Voer uw e-mailadres in","Skriv inn e-posten din","Wprowadź adres e-mail","Introduza o seu e-mail","Introduceți adresa de e-mail","Введите адрес электронной почты","Ange din e-postadress","กรุณากรอกอีเมลของคุณ","Lütfen e-postanızı girin","Введіть адресу електронної пошти","Vui lòng nhập email của bạn","请输入您的电子邮件"
  ),
  loginPasswordLabel: row(
    "Please enter your password",
    "Indtast din adgangskode","Εισαγάγετε τον κωδικό πρόσβασης","Please enter your password","Introduce tu contraseña","Anna salasanasi","Veuillez saisir votre mot de passe","הזינו את הסיסמה שלכם","कृपया अपना पासवर्ड दर्ज करें","Masukkan kata sandi Anda","Inserisci la password","パスワードを入力してください","Sila masukkan kata laluan anda","Voer uw wachtwoord in","Skriv inn passordet ditt","Wprowadź hasło","Introduza a palavra-passe","Introduceți parola","Введите пароль","Ange ditt lösenord","กรุณากรอกรหัสผ่านของคุณ","Lütfen şifrenizi girin","Введіть пароль","Vui lòng nhập mật khẩu của bạn","请输入您的密码"
  ),
  loginRememberMe: row(
    "Remember me",
    "Husk mig","Να με θυμάσαι","Remember me","Recordarme","Muista minut","Se souvenir de moi","זכור אותי","मुझे याद रखें","Ingat saya","Ricordami","ログイン状態を保持","Ingat saya","Onthoud mij","Husk meg","Zapamiętaj mnie","Lembrar-me","Ține-mă minte","Запомнить меня","Kom ihåg mig","จดจำฉัน","Beni hatırla","Запам’ятати мене","Ghi nhớ đăng nhập","记住我"
  ),
  hotkeyHint: row(
    "Tip: use Shift + letter shortcuts to jump between sections.",
    "Tip: Brug Shift + bogstav til at hoppe mellem sektioner.","Συμβουλή: Shift + γράμμα για μετάβαση.","Tip: use Shift + letter shortcuts to jump between sections.","Consejo: Shift + letra para saltar entre secciones.","Vihje: Shift + kirjain siirtyy osioiden välillä.","Astuce : Maj + lettre pour naviguer.","טיפ: Shift + אות למעבר בין אזורים.","टिप: सेक्शन बदलने के लिए Shift + अक्षर।","Tips: Shift + huruf untuk berpindah bagian.","Suggerimento: Maiusc + lettera per navigare.","ヒント: Shift + 文字でセクション移動。","Petua: Shift + huruf untuk navigasi.","Tip: Shift + letter om te navigeren.","Tips: Shift + bokstav for navigering.","Wskazówka: Shift + litera do nawigacji.","Dica: Shift + letra para navegar.","Sfat: Shift + literă pentru navigare.","Подсказка: Shift + буква для перехода.","Tips: Skift + bokstav för att navigera.","เคล็ดลับ: Shift + ตัวอักษรเพื่อไปยังส่วนต่างๆ","İpucu: Bölümler arası geçiş için Shift + harf.","Порада: Shift + літера для навігації.","Mẹo: Shift + chữ cái để chuyển mục.","提示：Shift + 字母 可快速跳转。"
  ),
  timeAgo1d: row(
    "Yesterday",
    "I går","Χθες","Yesterday","Ayer","Eilen","Hier","אתמול","कल","Kemarin","Ieri","昨日","Semalam","Gisteren","I går","Wczoraj","Ontem","Ieri","Вчера","Igår","เมื่อวาน","Dün","Вчора","Hôm qua","昨天"
  )
};

applyAdminLocalizations(PHRASES, L, row);

export function buildAdminDict(lang) {
  const p = PHRASES;
  const v = (key) => p[key][lang] ?? p[key].en;
  return {
    "nav.dashboard": v("dashboard"),
    "nav.users": v("users"),
    "nav.admins": v("admins"),
    "nav.roles": v("roles"),
    "nav.transactions": v("transactions"),
    "nav.collapse": v("collapse"),
    "nav.expand": v("expand"),
    "nav.section": v("section"),
    "topbar.themeLight": v("themeLight"),
    "topbar.themeDark": v("themeDark"),
    "topbar.language": v("language"),
    "topbar.logout": v("logout"),
    "topbar.profile": v("profile"),
    "topbar.searchLanguages": v("search"),
    "topbar.notifications": v("notifications"),
    "sidebar.brandLine": "Zamok Today",
    "sidebar.brandSub": v("brandSub"),
    "sidebar.adminBadge": v("adminBadge"),
    "notifications.title": v("notifications"),
    "notifications.empty": v("notificationsEmpty"),
    "notifications.markAllRead": v("markAllRead"),
    "notifications.demo1Title": v("notifDemo1Title"),
    "notifications.demo1Body": v("notifDemo1Body"),
    "notifications.demo2Title": v("notifDemo2Title"),
    "notifications.demo2Body": v("notifDemo2Body"),
    "notifications.time2h": v("timeAgo2h"),
    "notifications.time1d": v("timeAgo1d"),
    "hotkey.opening": v("hotkeyOpening"),
    "hotkey.dismiss": v("hotkeyDismiss"),
    "hotkey.hint": v("hotkeyHint"),
    "login.email": v("email"),
    "login.emailLabel": v("loginEmailLabel"),
    "login.password": v("password"),
    "login.passwordLabel": v("loginPasswordLabel"),
    "login.subtitle": v("loginSubtitle"),
    "login.rememberMe": v("loginRememberMe"),
    "login.submit": v("signIn"),
    "login.wait": v("pleaseWait"),
    "login.failed": v("loginFailed"),
    "auth.showPassword": v("showPassword"),
    "auth.hidePassword": v("hidePassword"),
    "page.dashboard.title": v("dashboard"),
    "page.dashboard.subtitle": v("dashboardSubtitle"),
    "page.dashboard.welcome": v("welcomeBack"),
    "page.dashboard.role": v("role"),
    "page.dashboard.account": v("account"),
    "page.dashboard.status": v("status"),
    "page.dashboard.active": v("active"),
    "page.users.title": v("usersTitle"),
    "page.users.subtitle": v("usersSubtitle"),
    "page.users.placeholder": v("usersPlaceholder"),
    "page.admins.title": v("adminsTitle"),
    "page.admins.subtitle": v("adminsSubtitle"),
    "page.admins.placeholder": v("adminsPlaceholder"),
    "page.roles.title": v("rolesTitle"),
    "page.roles.subtitle": v("rolesSubtitle"),
    "page.roles.placeholder": v("rolesPlaceholder"),
    "page.transactions.title": v("transactionsTitle"),
    "page.transactions.subtitle": v("transactionsSubtitle"),
    "page.transactions.placeholder": v("transactionsPlaceholder"),
    "page.profile.title": v("profileTitle"),
    "page.profile.subtitle": v("profileSubtitle"),
    "page.profile.fullName": v("fullName"),
    "table.comingSoon": v("comingSoon"),
    "table.id": v("id"),
    "table.email": v("email"),
    "table.name": v("name"),
    "table.date": v("date"),
    "table.amount": v("amount"),
    "table.status": v("status"),
    "table.actions": v("actions"),
    "table.phone": v("phone"),
    "table.authMethod": v("authMethod"),
    "table.registered": v("registered"),
    "table.type": v("tableType"),
    "table.description": v("tableDescription"),
    "transactions.type.top_up": v("txTypeTopUp"),
    "transactions.type.payment": v("txTypePayment"),
    "transactions.type.refund": v("txTypeRefund"),
    "transactions.status.completed": v("txStatusCompleted"),
    "transactions.status.failed": v("txStatusFailed"),
    "transactions.status.pending": v("txStatusPending"),
    "transactions.table.empty": v("transactionsTableEmpty"),
    "transactions.table.noResults": v("transactionsTableNoResults"),
    "transactions.table.info": v("transactionsTableInfo"),
    "transactions.table.infoEmpty": v("transactionsTableInfoEmpty"),
    "transactions.table.infoFiltered": v("transactionsTableInfoFiltered"),
    "transactions.table.search": v("transactionsTableSearch"),
    "transactions.table.lengthMenu": v("transactionsTableLengthMenu"),
    "transactions.table.processing": v("transactionsTableProcessing"),
    "transactions.period.label": v("transactionsPeriod"),
    "transactions.period.from": v("transactionsDateFrom"),
    "transactions.period.to": v("transactionsDateTo"),
    "transactions.period.apply": v("transactionsPeriodApply"),
    "transactions.period.clear": v("transactionsPeriodClear"),
    "transactions.period.placeholder": v("transactionsPeriodPlaceholder"),
    "users.authMethod.phone": v("authMethodPhone"),
    "users.authMethod.email": v("authMethodEmail"),
    "users.status.verified": v("statusVerified"),
    "users.status.unverified": v("statusUnverified"),
    "users.table.empty": v("usersTableEmpty"),
    "users.table.noResults": v("usersTableNoResults"),
    "users.table.info": v("usersTableInfo"),
    "users.table.infoEmpty": v("usersTableInfoEmpty"),
    "users.table.infoFiltered": v("usersTableInfoFiltered"),
    "users.table.search": v("usersTableSearch"),
    "users.table.lengthMenu": v("usersTableLengthMenu"),
    "users.table.processing": v("usersTableProcessing"),
    "users.table.loadError": v("usersTableLoadError"),
    "users.accountStatus.label": v("accountStatusLabel"),
    "users.verification.label": v("verificationLabel"),
    "users.accountStatus.active": v("accountStatusActive"),
    "users.accountStatus.suspended": v("accountStatusSuspended"),
    "users.actions.viewWallet": v("viewWallet"),
    "common.cancel": v("cancel"),
    "users.actions.suspendTitle": v("suspendTitle"),
    "users.actions.suspend": v("suspendAccount"),
    "users.actions.unsuspend": v("unsuspendAccount"),
    "users.actions.suspendConfirm": v("suspendConfirm"),
    "users.actions.statusUpdated": v("statusUpdated"),
    "users.actions.statusError": v("statusError"),
    "users.wallet.title": v("walletTitle"),
    "users.wallet.balance": v("walletBalance"),
    "users.wallet.recentTransactions": v("walletRecentTx"),
    "users.wallet.noTransactions": v("walletNoTx"),
    "users.wallet.loading": v("walletLoading"),
    "users.wallet.loadError": v("walletLoadError"),
    "users.wallet.close": v("walletClose"),
    "admins.role.superAdmin": v("adminsRoleSuper"),
    "admins.role.admin": v("adminsRoleAdmin"),
    "admins.table.pages": v("adminsPagesCol"),
    "admins.actions.createAdmin": v("adminsCreateAdmin"),
    "admins.actions.edit": v("adminsEdit"),
    "admins.actions.create": v("adminsCreate"),
    "admins.form.save": v("adminsSave"),
    "admins.form.createTitle": v("adminsFormCreateTitle"),
    "admins.form.editTitle": v("adminsFormEditTitle"),
    "admins.form.pagesLabel": v("adminsFormPages"),
    "admins.form.passwordHint": v("adminsFormPasswordHint"),
    "admins.form.selectOnePage": v("adminsFormSelectPage"),
    "admins.actions.suspendTitle": v("adminsSuspendTitle"),
    "admins.actions.suspendConfirm": v("adminsSuspendConfirm"),
    "admins.table.empty": v("adminsTableEmpty"),
    "admins.table.noResults": v("adminsTableNoResults"),
    "admins.table.info": v("adminsTableInfo"),
    "admins.table.infoEmpty": v("adminsTableInfoEmpty"),
    "admins.table.infoFiltered": v("adminsTableInfoFiltered"),
    "admins.table.search": v("adminsTableSearch"),
    "admins.table.lengthMenu": v("adminsTableLengthMenu"),
    "admins.table.processing": v("adminsTableProcessing"),
    "admins.table.self": v("adminsTableSelf"),
    "profile.accountSection": v("profileAccountSection"),
    "profile.accountHint": v("profileAccountHint"),
    "profile.saveProfile": v("profileSaveProfile"),
    "profile.saved": v("profileSaved"),
    "profile.saveError": v("profileSaveError"),
    "profile.passwordSection": v("profilePasswordSection"),
    "profile.passwordHint": v("profilePasswordHint"),
    "profile.currentPassword": v("profileCurrentPassword"),
    "profile.newPassword": v("profileNewPassword"),
    "profile.confirmPassword": v("profileConfirmPassword"),
    "profile.changePassword": v("profileChangePassword"),
    "profile.passwordSaved": v("profilePasswordSaved"),
    "profile.passwordError": v("profilePasswordError"),
    "profile.tab.general": v("profileTabGeneral"),
    "profile.tab.security": v("profileTabSecurity"),
    "profile.memberSince": v("profileMemberSince")
  };
}
