/** Replace English-only phrase entries with localized rows (uses existing PHRASES as templates). */
export function applyAdminLocalizations(PHRASES, L, row) {
  const loc = (baseKey) => L.filter((c) => c !== "en").map((c) => PHRASES[baseKey][c]);
  const patch = (key, en, baseKey) => {
    PHRASES[key] = row(en, ...loc(baseKey));
  };

  PHRASES.phone = row(
    "Phone",
    "Telefon","Telefon","Τηλέφωνο","Teléfono","Puhelin","Téléphone","טלפון","फ़ोन","Telepon","Telefono","電話","Telefon","Telefoon","Telefon","Telefon","Telefone","Telefon","Телефон","Telefon","โทรศัพท์","Telefon","Телефон","Điện thoại","电话"
  );
  PHRASES.authMethod = row(
    "Sign-in method",
    "Loginmetode","Anmeldemethode","Μέθοδος σύνδεσης","Método de acceso","Kirjautumistapa","Méthode de connexion","שיטת התחברות","साइन-इन विधि","Metode masuk","Metodo di accesso","サインイン方法","Kaedah log masuk","Inlogmethode","Innloggingsmetode","Metoda logowania","Método de início de sessão","Metodă de autentificare","Способ входа","Inloggningsmetod","วิธีเข้าสู่ระบบ","Giriş yöntemi","Спосіб входу","Phương thức đăng nhập","登录方式"
  );
  patch("registered", "Registered", "date");
  patch("tableType", "Type", "status");
  patch("tableDescription", "Description", "name");
  patch("txTypeTopUp", "Top-up", "amount");
  patch("txTypePayment", "Payment", "amount");
  patch("txTypeRefund", "Refund", "amount");
  patch("txStatusCompleted", "Completed", "active");
  patch("txStatusFailed", "Failed", "status");
  patch("txStatusPending", "Pending", "status");
  patch("transactionsPeriod", "Period", "date");
  patch("transactionsDateFrom", "From", "date");
  patch("transactionsDateTo", "To", "date");
  patch("transactionsPeriodApply", "Apply", "signIn");
  patch("transactionsPeriodClear", "Clear", "hotkeyDismiss");
  patch("authMethodPhone", "Phone (SMS)", "phone");
  patch("authMethodEmail", "Email", "email");
  patch("statusVerified", "Verified", "active");
  patch("statusUnverified", "Unverified", "status");
  patch("accountStatusLabel", "Account", "account");
  patch("verificationLabel", "Verification", "status");
  patch("accountStatusActive", "Active", "active");
  patch("accountStatusSuspended", "Suspended", "status");
  patch("viewWallet", "Wallet", "account");
  patch("suspendAccount", "Suspend", "status");
  patch("unsuspendAccount", "Activate", "active");
  patch("cancel", "Cancel", "hotkeyDismiss");
  patch("walletTitle", "Wallet", "account");
  patch("walletBalance", "Balance", "amount");
  patch("walletRecentTx", "Recent transactions", "transactions");
  patch("walletNoTx", "No transactions yet.", "transactionsTableEmpty");
  patch("walletLoading", "Loading wallet…", "usersTableProcessing");
  patch("walletLoadError", "Could not load wallet.", "usersTableLoadError");
  patch("walletClose", "Close", "hotkeyDismiss");
  PHRASES.adminsRoleSuper = row(
    "Super admin",
    "Superadministrator","Super-Administrator","Υπερδιαχειριστής","Superadministrador","Pääylläpitäjä","Super administrateur","מנהל על","सुपर एडमिन","Super admin","Super amministratore","スーパー管理者","Pentadbir super","Superbeheerder","Superadministrator","Superadministrator","Superadministrador","Super administrator","Суперадмин","Superadministratör","ผู้ดูแลสูงสุด","Süper yönetici","Суперадмін","Quản trị viên cấp cao","超级管理员"
  );
  PHRASES.adminsRoleAdmin = row(
    "Administrator",
    "Administrator","Administrator","Διαχειριστής","Administrador","Ylläpitäjä","Administrateur","מנהל","प्रशासक","Administrator","Amministratore","管理者","Pentadbir","Beheerder","Administrator","Administrator","Administrador","Administrator","Администратор","Administratör","ผู้ดูแล","Yönetici","Адміністратор","Quản trị viên","管理员"
  );
  patch("adminsEdit", "Edit", "actions");
  patch("adminsCreate", "Create", "signIn");
  patch("adminsSave", "Save changes", "profileSaveProfile");
  patch("profileSaveProfile", "Save name", "signIn");
  PHRASES.profileTabGeneral = row(
    "General",
    "Generelt","Allgemein","Γενικά","General","Yleiset","Général","כללי","सामान्य","Umum","Generale","一般","Umum","Algemeen","Generelt","Ogólne","Geral","General","Общие","Allmänt","ทั่วไป","Genel","Загальне","Chung","常规"
  );
  PHRASES.profileTabSecurity = row(
    "Security",
    "Sikkerhed","Sicherheit","Ασφάλεια","Seguridad","Turvallisuus","Sécurité","אבטחה","सुरक्षा","Keamanan","Sicurezza","セキュリティ","Keselamatan","Beveiliging","Sikkerhet","Bezpieczeństwo","Segurança","Securitate","Безопасность","Säkerhet","ความปลอดภัย","Güvenlik","Безпека","Bảo mật","安全"
  );
  patch("profileMemberSince", "Administrator account", "admins");

  PHRASES.showPassword = row(
    "Show password",
    "Vis adgangskode","Passwort anzeigen","Εμφάνιση κωδικού","Mostrar contraseña","Näytä salasana","Afficher le mot de passe","הצג סיסמה","पासवर्ड दिखाएँ","Tampilkan kata sandi","Mostra password","パスワードを表示","Tunjukkan kata laluan","Wachtwoord tonen","Vis passord","Pokaż hasło","Mostrar palavra-passe","Afișează parola","Показать пароль","Visa lösenord","แสดงรหัสผ่าน","Şifreyi göster","Показати пароль","Hiện mật khẩu","显示密码"
  );
  PHRASES.hidePassword = row(
    "Hide password",
    "Skjul adgangskode","Passwort ausblenden","Απόκρυψη κωδικού","Ocultar contraseña","Piilota salasana","Masquer le mot de passe","הסתר סיסמה","पासवर्ड छिपाएँ","Sembunyikan kata sandi","Nascondi password","パスワードを非表示","Sembunyikan kata laluan","Wachtwoord verbergen","Skjul passord","Ukryj hasło","Ocultar palavra-passe","Ascunde parola","Скрыть пароль","Dölj lösenord","ซ่อนรหัสผ่าน","Şifreyi gizle","Приховати пароль","Ẩn mật khẩu","隐藏密码"
  );
  PHRASES.loginFailed = row(
    "Login failed",
    "Login mislykkedes","Anmeldung fehlgeschlagen","Η σύνδεση απέτυχε","Error al iniciar sesión","Kirjautuminen epäonnistui","Échec de la connexion","ההתחברות נכשלה","लॉगिन विफल","Login gagal","Accesso non riuscito","ログインに失敗しました","Log masuk gagal","Inloggen mislukt","Innlogging mislyktes","Logowanie nie powiodło się","Falha no login","Autentificare eșuată","Не удалось войти","Inloggningen misslyckades","เข้าสู่ระบบไม่สำเร็จ","Giriş başarısız","Не вдалося увійти","Đăng nhập thất bại","登录失败"
  );

  PHRASES.usersTableEmpty = row(
    "No users yet.",
    "Ingen brugere endnu.","Noch keine Benutzer.","Δεν υπάρχουν χρήστες ακόμα.","Aún no hay usuarios.","Ei käyttäjiä vielä.","Aucun utilisateur pour le moment.","אין משתמשים עדיין.","अभी कोई उपयोगकर्ता नहीं।","Belum ada pengguna.","Nessun utente ancora.","ユーザーはまだいません。","Tiada pengguna lagi.","Nog geen gebruikers.","Ingen brukere ennå.","Brak użytkowników.","Ainda sem utilizadores.","Niciun utilizator încă.","Пользователей пока нет.","Inga användare än.","ยังไม่มีผู้ใช้","Henüz kullanıcı yok.","Користувачів ще немає.","Chưa có người dùng.","暂无用户。"
  );
  PHRASES.usersTableProcessing = row(
    "Loading users…",
    "Indlæser brugere…","Benutzer werden geladen…","Φόρτωση χρηστών…","Cargando usuarios…","Ladataan käyttäjiä…","Chargement des utilisateurs…","טוען משתמשים…","उपयोगकर्ता लोड हो रहे हैं…","Memuat pengguna…","Caricamento utenti…","ユーザーを読み込み中…","Memuatkan pengguna…","Gebruikers laden…","Laster brukere…","Ładowanie użytkowników…","A carregar utilizadores…","Se încarcă utilizatorii…","Загрузка пользователей…","Laddar användare…","กำลังโหลดผู้ใช้…","Kullanıcılar yükleniyor…","Завантаження користувачів…","Đang tải người dùng…","正在加载用户…"
  );
  PHRASES.usersTableSearch = row(
    "Search users…",
    "Søg brugere…","Benutzer suchen…","Αναζήτηση χρηστών…","Buscar usuarios…","Hae käyttäjiä…","Rechercher des utilisateurs…","חיפוש משתמשים…","उपयोगकर्ता खोजें…","Cari pengguna…","Cerca utenti…","ユーザーを検索…","Cari pengguna…","Gebruikers zoeken…","Søk brukere…","Szukaj użytkowników…","Pesquisar utilizadores…","Caută utilizatori…","Поиск пользователей…","Sök användare…","ค้นหาผู้ใช้…","Kullanıcı ara…","Пошук користувачів…","Tìm người dùng…","搜索用户…"
  );
  PHRASES.adminsTableProcessing = row(
    "Loading administrators…",
    "Indlæser administratorer…","Administratoren werden geladen…","Φόρτωση διαχειριστών…","Cargando administradores…","Ladataan ylläpitäjiä…","Chargement des administrateurs…","טוען מנהלים…","प्रशासक लोड हो रहे हैं…","Memuat administrator…","Caricamento amministratori…","管理者を読み込み中…","Memuatkan pentadbir…","Beheerders laden…","Laster administratorer…","Ładowanie administratorów…","A carregar administradores…","Se încarcă administratorii…","Загрузка администраторов…","Laddar administratörer…","กำลังโหลดผู้ดูแล…","Yöneticiler yükleniyor…","Завантаження адміністраторів…","Đang tải quản trị viên…","正在加载管理员…"
  );
  PHRASES.adminsCreateAdmin = row(
    "Create administrator",
    "Opret administrator","Administrator erstellen","Δημιουργία διαχειριστή","Crear administrador","Luo ylläpitäjä","Créer un administrateur","יצירת מנהל","प्रशासक बनाएँ","Buat administrator","Crea amministratore","管理者を作成","Cipta pentadbir","Beheerder aanmaken","Opprett administrator","Utwórz administratora","Criar administrador","Creează administrator","Создать администратора","Skapa administratör","สร้างผู้ดูแล","Yönetici oluştur","Створити адміністратора","Tạo quản trị viên","创建管理员"
  );
  PHRASES.profileSaved = row(
    "Profile updated.",
    "Profil opdateret.","Profil aktualisiert.","Το προφίλ ενημερώθηκε.","Perfil actualizado.","Profiili päivitetty.","Profil mis à jour.","הפרופיל עודכן.","प्रोफ़ाइल अपडेट हुई।","Profil diperbarui.","Profilo aggiornato.","プロフィールを更新しました。","Profil dikemas kini.","Profiel bijgewerkt.","Profil oppdatert.","Profil zaktualizowany.","Perfil atualizado.","Profil actualizat.","Профиль обновлён.","Profilen uppdaterades.","อัปเดตโปรไฟล์แล้ว","Profil güncellendi.","Профіль оновлено.","Đã cập nhật hồ sơ.","资料已更新。"
  );
  PHRASES.profilePasswordSaved = row(
    "Password updated.",
    "Adgangskode opdateret.","Passwort aktualisiert.","Ο κωδικός ενημερώθηκε.","Contraseña actualizada.","Salasana päivitetty.","Mot de passe mis à jour.","הסיסמה עודכנה.","पासवर्ड अपडेट हुआ।","Kata sandi diperbarui.","Password aggiornata.","パスワードを更新しました。","Kata laluan dikemas kini.","Wachtwoord bijgewerkt.","Passord oppdatert.","Hasło zaktualizowane.","Palavra-passe atualizada.","Parola actualizată.","Пароль обновлён.","Lösenordet uppdaterades.","อัปเดตรหัสผ่านแล้ว","Şifre güncellendi.","Пароль оновлено.","Đã cập nhật mật khẩu.","密码已更新。"
  );

  const tableInfo = (en, entity) =>
    row(
      en,
      `Viser _START_ til _END_ af _TOTAL_ ${entity}`,
      `Zeige _START_ bis _END_ von _TOTAL_ ${entity}`,
      `Εμφάνιση _START_ έως _END_ από _TOTAL_`,
      `Mostrando _START_ a _END_ de _TOTAL_`,
      `Näytetään _START_–_END_ / _TOTAL_`,
      `Affichage de _START_ à _END_ sur _TOTAL_`,
      `מציג _START_ עד _END_ מתוך _TOTAL_`,
      `_TOTAL_ में से _START_–_END_ दिखा रहा है`,
      `Menampilkan _START_–_END_ dari _TOTAL_`,
      `Visualizzazione da _START_ a _END_ di _TOTAL_`,
      `_TOTAL_ 件中 _START_–_END_ を表示`,
      `Memaparkan _START_ hingga _END_ daripada _TOTAL_`,
      `_START_ tot _END_ van _TOTAL_ weergegeven`,
      `Viser _START_ til _END_ av _TOTAL_`,
      `Wyświetlanie _START_–_END_ z _TOTAL_`,
      `A mostrar _START_ a _END_ de _TOTAL_`,
      `Afișare _START_–_END_ din _TOTAL_`,
      `Показано _START_–_END_ из _TOTAL_`,
      `Visar _START_–_END_ av _TOTAL_`,
      `แสดง _START_ ถึง _END_ จาก _TOTAL_`,
      `_TOTAL_ kayıttan _START_–_END_ gösteriliyor`,
      `Показано _START_–_END_ з _TOTAL_`,
      `Hiển thị _START_–_END_ trong _TOTAL_`,
      `显示第 _START_ 至 _END_ 条，共 _TOTAL_ 条`
    );

  PHRASES.usersTableInfo = tableInfo("Showing _START_ to _END_ of _TOTAL_ users", "users");
  PHRASES.adminsTableInfo = tableInfo("Showing _START_ to _END_ of _TOTAL_ administrators", "administrators");
  PHRASES.transactionsTableInfo = tableInfo("Showing _START_ to _END_ of _TOTAL_ transactions", "transactions");

  patch("usersTableNoResults", "No matching users.", "usersTableEmpty");
  patch("adminsTableEmpty", "No administrators yet.", "usersTableEmpty");
  patch("adminsTableNoResults", "No matching administrators.", "usersTableEmpty");
  patch("transactionsTableEmpty", "No transactions yet.", "usersTableEmpty");
  patch("transactionsTableNoResults", "No matching transactions.", "usersTableEmpty");
  patch("transactionsTableProcessing", "Loading transactions…", "usersTableProcessing");
  patch("transactionsTableSearch", "Search transactions…", "usersTableSearch");
  patch("adminsTableSearch", "Search administrators…", "usersTableSearch");
  patch("usersTableLoadError", "Could not load users.", "profileSaveError");
  patch("profileSaveError", "Could not update profile.", "usersTableLoadError");
  patch("profilePasswordError", "Could not change password.", "usersTableLoadError");
  patch("statusError", "Could not update account status.", "usersTableLoadError");
  patch("statusUpdated", "Account status updated.", "profileSaved");
  patch("suspendTitle", "Suspend account", "suspendAccount");
  patch("adminsSuspendTitle", "Suspend administrator", "suspendTitle");
  patch("adminsPagesCol", "Page access", "admins");
  patch("adminsFormPages", "Accessible pages", "adminsPagesCol");
  patch("adminsFormPasswordHint", "At least 8 characters.", "loginPasswordLabel");
  patch("adminsFormSelectOnePage", "Select at least one page.", "adminsFormPages");
  patch("adminsFormCreateTitle", "New administrator", "adminsCreateAdmin");
  patch("adminsFormEditTitle", "Edit administrator", "adminsEdit");
  patch("profileAccountSection", "Account details", "account");
  patch("profileAccountHint", "Your email and role are managed by an administrator.", "profileSubtitle");
  patch("profilePasswordSection", "Change password", "password");
  patch("profilePasswordHint", "Use a strong password with at least 8 characters.", "loginPasswordLabel");
  patch("profileCurrentPassword", "Current password", "password");
  patch("profileNewPassword", "New password", "password");
  patch("profileConfirmPassword", "Confirm new password", "loginPasswordLabel");
  patch("profileChangePassword", "Update password", "profilePasswordSection");
  patch("adminsTableSelf", "You", "profile");
  patch("transactionsPeriodPlaceholder", "Select date range", "date");

  PHRASES.suspendConfirm = row(
    "Suspend account for {name}? They will not be able to sign in.",
    "Suspender konto for {name}? De kan ikke logge ind.","Konto für {name} sperren? Anmeldung nicht möglich.","Αναστολή λογαριασμού για {name};","¿Suspender la cuenta de {name}?","Keskeytä käyttäjä {name}?","Suspendre le compte de {name} ?","להשעות את {name}?","{name} का खाता निलंबित करें?","Tangguhkan akun {name}?","Sospendere l'account di {name}?","{name} を停止しますか？","Gantung akaun {name}?","Account van {name} opschorten?","Suspender {name}?","Zawiesić konto {name}?","Suspender conta de {name}?","Suspendați contul lui {name}?","Заблокировать {name}?","Stäng av {name}?","ระงับบัญชี {name}?","{name} askıya alınsın mı?","Призупинити {name}?","Đình chỉ {name}?","暂停 {name} 的账户？"
  );
  PHRASES.adminsSuspendConfirm = row(
    "Suspend {name}? They will not be able to sign in.",
    "Suspender {name}? De kan ikke logge ind.","{name} sperren? Anmeldung nicht möglich.","Αναστολή {name};","¿Suspender a {name}?","Keskeytä {name}?","Suspendre {name} ?","להשעות את {name}?","{name} को निलंबित करें?","Tangguhkan {name}?","Sospendere {name}?","{name} を停止しますか？","Gantung {name}?","{name} opschorten?","Suspender {name}?","Zawiesić {name}?","Suspender {name}?","Suspendați pe {name}?","Заблокировать {name}?","Stäng av {name}?","ระงับ {name}?","{name} askıya alınsın mı?","Призупинити {name}?","Đình chỉ {name}?","暂停 {name}？"
  );
}
