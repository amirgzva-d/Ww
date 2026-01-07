document.addEventListener('DOMContentLoaded', () => {
  // --- Page Navigation Logic ---
  const navLinks = document.querySelectorAll('.nav-link');
  const pageContents = document.querySelectorAll('.page-content');
  const header = document.querySelector('.site-header');

  const switchPage = (pageId, scrollTargetId) => {
    pageContents.forEach(page => page.style.display = 'none');
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
      targetPage.style.display = 'block';
    }

    document.querySelectorAll('.nav-links .nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageId && !link.dataset.scroll) {
            link.classList.add('active');
        }
    });
    
    if (pageId === 'home') {
        const homeLink = document.querySelector('.nav-links .nav-link[data-page="home"]');
        if(homeLink) homeLink.classList.add('active');
    }

    if (pageId !== 'home') {
        header.classList.add('light-bg');
    } else {
        if (window.scrollY <= 50) {
            header.classList.remove('light-bg');
        } else {
            header.classList.add('light-bg');
        }
    }

    if (scrollTargetId) {
        const scrollTarget = document.getElementById(scrollTargetId);
        if(scrollTarget) {
            scrollTarget.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        window.scrollTo(0, 0);
    }
  };

  // ***** CORRECTED AND FINAL NAVIGATION HANDLER *****
  // This listener handles all clicks on the body to find navigation links.
  document.body.addEventListener('click', (e) => {
      // Find the closest link that has a 'data-page' attribute.
      const navLink = e.target.closest('.nav-link[data-page]');

      // If such a link is found, handle the page switch.
      if (navLink) {
          // Prevent the default link behavior (like jumping to an anchor #)
          e.preventDefault();
          const pageId = navLink.dataset.page;
          const scrollTargetId = navLink.dataset.scroll;
          switchPage(pageId, scrollTargetId);
      }
      // If the clicked link does NOT have 'data-page' (like the mailto: link),
      // this code does nothing, and the browser handles the link normally.
  });
  // ***** END OF CORRECTION *****


  // --- Product Card Flip Logic ---
  const cardItems = document.querySelectorAll('.card-list > li');
  cardItems.forEach(item => {
    item.addEventListener('click', (event) => {
      if (event.target.closest('a')) return;
      item.classList.toggle('is-flipped');
    });
  });

  // --- Scroll Animation for Products & About Page ---
  const animatedItems = document.querySelectorAll('.product-item, .animate-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  animatedItems.forEach(item => {
    observer.observe(item);
  });

  // --- Department Tabs Logic ---
  const tabContainers = document.querySelectorAll('.dept-tabs');
  if (tabContainers) {
    tabContainers.forEach(container => {
        const tabs = container.querySelectorAll('li');
        const contentContainer = container.nextElementSibling;
        const contents = contentContainer.querySelectorAll('.dept-content');

        container.addEventListener('click', (e) => {
            const clickedTab = e.target.closest('li');
            if (!clickedTab) return;

            tabs.forEach(tab => tab.classList.remove('active'));
            clickedTab.classList.add('active');

            const targetId = clickedTab.dataset.tab;
            contents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetId) {
                    content.classList.add('active');
                }
            });
        });
    });
  }

  // --- Header background on Scroll (for Home page) ---
  window.addEventListener('scroll', () => {
    const isHomePage = document.getElementById('page-home').style.display === 'block';
    if (isHomePage) {
        if (window.scrollY > 50) {
            header.classList.add('light-bg');
        } else {
            header.classList.remove('light-bg');
        }
    }
  });

  // --- Video Modal Logic ---
  const videoModal = document.getElementById('video-modal');
  const openModalBtn = document.getElementById('open-video-modal');
  const closeModalBtn = document.getElementById('close-video-modal');
  const catalogVideo = document.getElementById('catalog-video');

  const openModal = () => {
    videoModal.style.display = 'flex';
    if (catalogVideo.paused) catalogVideo.play();
  };
  const closeModal = () => {
    videoModal.style.display = 'none';
    catalogVideo.pause();
    catalogVideo.currentTime = 0;
  };

  openModalBtn.addEventListener('click', openModal);
  closeModalBtn.addEventListener('click', closeModal);
  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
      closeModal();
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.style.display === 'flex') {
        closeModal();
    }
  });

  // --- Dark/Light Mode Toggle Logic ---
  const themeToggles = document.querySelectorAll('.theme-toggle-checkbox');
  const applyTheme = (theme) => {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    themeToggles.forEach(toggle => { toggle.checked = (theme === 'dark'); });
  };
  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);
  themeToggles.forEach(toggle => {
    toggle.addEventListener('change', () => {
      const newTheme = toggle.checked ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      applyTheme(newTheme);
    });
  });

  // --- Language Switcher Logic ---
  const languageSwitcher = document.querySelector('.language-switcher');
  const langButton = document.querySelector('.language-btn');
  const currentLangSpan = document.getElementById('current-lang');
  const langLinks = document.querySelectorAll('[data-lang]');
  
  const translations = {
    en: { "nav_home": "Home", "nav_products": "Products", "nav_departments": "Departments", "nav_about": "About Us", "nav_contact": "Contact", "nav_catalog": "View Catalog", "products_title": "Our Products", "specifications": "Specifications", "view_details": "View Details", "product1_title": "Steel Sheet", "product1_desc": "Experience the next generation.", "product2_title": "Steel Beams", "product2_desc": "Sleek design, powerful performance.", "product3_title": "Steel Billet", "product3_desc": "Advanced features for professionals.", "product4_title": "Steel Angle", "product4_desc": "Lightweight and portable.", "product5_title": "Steel Ready", "product5_desc": "Affordable with essential features.", "product6_title": "Steel Square Tube", "product6_desc": "Upgraded with enhanced capabilities.", "product7_title": "Steel Slab", "product7_desc": "Heavy-duty slabs for major constructions.", "product8_title": "Steel Redar", "product8_desc": "Reinforcing bars for concrete structures.", "manager1_name": "Hashem Mohajeri", "manager1_title": "Managing Director", "manager1_desc": "Hashem Mohajeri started his role as Managing Director of Mohajer Trading Group in 2019.", "manager2_name": "Ali Mohajeri", "manager2_title": "Director of the Steel Group", "manager2_desc": "began her career as Director of the Mohajer Trading Group in 1989.", "reasons_prefix": "Some reasons to", "reasons_suffix": "Choose Us", "reason1_title": "Specialist team in international trade affairs", "reason1_desc": "Our experienced team provides expert guidance and seamless execution for all your international trade needs.", "reason2_title": "Commitment to professionalism, honesty, and precise timing", "reason2_desc": "We operate with the highest standards of integrity, ensuring transparent processes and on-time delivery.", "reason3_title": "Extensive network of business partners inside and outside the country", "reason3_desc": "Leverage our vast network of trusted partners to unlock new opportunities and streamline your supply chain.", "learn_more": "Learn more", "departments_title": "Our Departments", "dept_steel_title": "Steel", "dept_petro_title": "Petrochemical", "dept_food_title": "Foodstuff", "dept_steel_desc": "Leading the industry in production and distribution of high-quality steel products...", "dept_petro_desc": "Providing a wide range of petrochemical products, from essential polymers to base chemicals...", "dept_food_desc": "Sourcing and trading a diverse portfolio of high-quality food products...", "know_more": "Know More", "about_page_title": "About Mohajer Steel Co.", "about_subtitle": "Pioneering the future of steel trading with integrity, quality, and global reach. Discover our story and the values that drive us forward.", "intro_title": "Introduction to Mohajer Trading Group", "intro_text": "Mohajer Trading Company was established in 1995 (1374 in Persian calendar) according to the goals and economic policies of the Islamic Republic of Iran. The company's activities include all kinds of economic activities (industrial, production, and services), especially trading, including import, export, and transit for domestic and foreign companies, particularly in goods, along with commercial activities and other profitable areas including petrochemicals and related industries, investment and partnership in companies and commercial projects. In 2018 (1397 Persian calendar), Mohajer Company expanded by establishing Mobin Trading Company.", "dept_steel_full_desc": "Our Steel Division is the cornerstone of our business. We specialize in sourcing and distributing a comprehensive range of high-quality steel products, including billets, slabs, beams, and sheets. With a robust global network and a commitment to excellence, we ensure timely delivery and competitive pricing for projects of any scale.", "dept_petro_full_desc": "Our Petrochemical Division bridges the gap between producers and consumers in the chemical industry. We trade a wide array of products, from essential polymers to base chemicals, ensuring a reliable supply chain for our partners. Our market expertise allows us to navigate volatile markets and deliver value consistently.", "dept_food_full_desc": "In our Foodstuff Division, we focus on the global trade of high-quality agricultural commodities and food products. We connect farmers and producers with markets around the world, handling logistics and quality control to ensure that every shipment meets the highest standards of safety and freshness.", "contact_page_title": "Get In Touch", "our_address": "Our Address", "address_detail": "Unit 313, 3rd Floor, Pazh 2 Tower, Janbaz Blvd, Mashhad, Iran", "call_us": "Call Us", "phone_detail_1": "+98-51-37057124-5", "phone_detail_2": "+98-915-302-7342", "phone_detail_3": "+98-915-590-1466", "email_us": "Email Us", "email_detail": "Mohajersteelco@gmail.com", "price_inquiry_title": "Price Inquiry", "consultant_name_ali": "Ali Mohajeri", "consultant_title_ali": "Sales Manager", "consultant_name_hashem": "Hashem Mohajeri", "consultant_title_hashem": "Managing Director", "consultant_email_hashem": "mohajer90@yahoo.com", "request_quote_consultant": "Request a Quote", "products_page_title": "Explore Our Full Range of Products", "product1_full_desc": "High-quality steel sheets available in various grades and thicknesses, perfect for construction, automotive, and manufacturing applications. Engineered for durability and performance.", "product2_full_desc": "Structural steel beams (I-beams, H-beams) providing superior strength and support for large-scale construction projects. Available in standard and custom sizes.", "product3_full_desc": "Semi-finished steel billets, ideal for rolling, forging, and other processing applications. Produced with advanced casting technology for superior internal quality.", "product4_full_desc": "Versatile and lightweight steel angles for framing, brackets, and structural reinforcements. Available in equal and unequal leg sizes to meet diverse project needs.", "product5_full_desc": "A comprehensive range of ready-to-use steel components, including plates and bars, cut to size for immediate deployment in your projects, saving time and resources.", "product6_full_desc": "High-strength, welded steel square tubing for structural and mechanical applications. Offers excellent torsional strength and a clean, modern aesthetic.", "product7_full_desc": "Heavy-duty, semi-finished steel slabs, primarily used for the production of flat-rolled products such as plates and coils. Our slabs are known for their uniform structure and purity.", "product8_full_desc": "High-tensile steel reinforcing bars (rebar) used to strengthen and reinforce concrete structures. Our rebar provides superior bonding and is treated for corrosion resistance.", "analysis_grade": "Grade", "analysis_size": "Size", "analysis_width": "Width", "analysis_breath": "Breath", "analysis_length": "Length", "steel_ready_lengths": "6mill to 12mill", "request_quote": "Request a Quote", "hero_ingot": "Iron Ingot", "hero_rebar": "Rebar", "hero_slab": "Slab", "hero_ingot_selector": "Iron Ingot", "hero_rebar_selector": "Rebar", "hero_slab_selector": "Slab" },
    fa: { "nav_home": "خانه", "nav_products": "محصولات", "nav_departments": "دپارتمان‌ها", "nav_about": "درباره ما", "nav_contact": "تماس با ما", "nav_catalog": "مشاهده کاتالوگ", "products_title": "محصولات ما", "specifications": "مشخصات", "view_details": "مشاهده جزئیات", "product1_title": "ورق فولادی", "product1_desc": "نسل بعدی تجربه را کشف کنید.", "product2_title": "تیرآهن", "product2_desc": "طراحی شیک، عملکرد قدرتمند.", "product3_title": "بیلت فولادی", "product3_desc": "ویژگی‌های پیشرفته برای حرفه‌ای‌ها.", "product4_title": "نبشی فولادی", "product4_desc": "سبک و قابل حمل.", "product5_title": "آهن‌آلات آماده", "product5_desc": "مقرون به صرفه با ویژگی‌های ضروری.", "product6_title": "پروفیل مربع فولادی", "product6_desc": "ارتقا یافته با قابلیت‌های بهبود یافته.", "product7_title": "اسلب فولادی", "product7_desc": "اسلب‌های سنگین برای ساخت و سازهای بزرگ.", "product8_title": "میلگرد فولادی", "product8_desc": "میلگردهای تقویتی برای سازه‌های بتنی.", "manager1_name": "هاشم مهاجeri", "manager1_title": "مدیر عامل", "manager1_desc": "هاشم مهاجری فعالیت خود را به عنوان مدیر عامل گروه بازرگانی مهاجر در سال ۱۳۹۸ آغاز کرد.", "manager2_name": "علی مهاجری", "manager2_title": "مدیر گروه فولاد", "manager2_desc": "فعالیت خود را به عنوان مدیر گروه بازرگانی مهاجر در سال ۱۳۶۸ آغاز کرد.", "reasons_prefix": "دلایلی برای", "reasons_suffix": "انتخاب ما", "reason1_title": "تیم متخصص در امور تجارت بین‌الملل", "reason1_desc": "تیم مجرب ما راهنمایی تخصصی و اجرای بی‌درنگ را برای تمام نیازهای تجارت بین‌المللی شما فراهم می‌کند.", "reason2_title": "تعهد به حرفه‌ای‌گری، صداقت و زمان‌بندی دقیق", "reason2_desc": "ما با بالاترین استانداردهای یکپارچگی عمل می‌کنیم و از فرآیندهای شفاف و تحویل به موقع اطمینان می‌دهیم.", "reason3_title": "شبکه گسترده شرکای تجاری در داخل و خارج از کشور", "reason3_desc": "از شبکه گسترده شرکای مورد اعتماد ما برای گشودن فرصت‌های جدید و بهینه‌سازی زنجیره تامین خود بهره ببرید.", "learn_more": "بیشتر بدانید", "departments_title": "دپارتمان‌های ما", "dept_steel_title": "فولاد", "dept_petro_title": "پتروشیمی", "dept_food_title": "مواد غذایی", "dept_steel_desc": "پیشرو در صنعت تولید و توزیع محصولات فولادی با کیفیت بالا...", "dept_petro_desc": "ارائه دهنده طیف گسترده‌ای از محصولات پتروشیمی...", "dept_food_desc": "تامین و تجارت مجموعه متنوعی از محصولات غذایی...", "know_more": "بیشتر بدانید", "about_page_title": "درباره شرکت فولاد مهاجر", "about_subtitle": "پیشگام در آینده تجارت فولاد با یکپارچگی، کیفیت و دسترسی جهانی. داستان ما و ارزش‌هایی که ما را به پیش می‌برند را کشف کنید.", "intro_title": "معرفی گروه بازرگانی مهاجر", "intro_text": "شرکت بازرگانی مهاجر در سال ۱۳۷۴ بر اساس اهداف و سیاست‌های اقتصادی جمهوری اسلامی ایران تاسیس گردید. فعالیت این شرکت شامل انواع فعالیت‌های اقتصادی (صنعتی، تولیدی و خدماتی)، به ویژه بازرگانی اعم از واردات، صادرات و ترانزیت برای شرکت‌های داخلی و خارجی به خصوص در کالاها، همراه با فعالیت‌های تجاری و سایر زمینه‌های سودآور از جمله پتروشیمی و صنایع وابسته، سرمایه‌گذاری و مشارکت در شرکت‌ها و پروژه‌های تجاری می‌باشد. در سال ۱۳۹۷ شرکت مهاجر با تاسیس شرکت بازرگانی مبین گسترش یافت.", "dept_steel_full_desc": "بخش فولاد ما سنگ بنای کسب و کار ماست. ما در تامین و توزیع طیف گسترده‌ای از محصولات فولادی با کیفیت بالا، از جمله بیلت، اسلب، تیرآهن و ورق تخصص داریم. با یک شبکه جهانی قوی و تعهد به برتری، ما تحویل به موقع و قیمت‌گذاری رقابتی را برای پروژه‌ها در هر مقیاسی تضمین می‌کنیم.", "dept_petro_full_desc": "بخش پتروشیمی ما پل ارتباطی بین تولیدکنندگان و مصرف‌کنندگان در صنعت شیمیایی است. ما طیف وسیعی از محصولات، از پلیمرهای ضروری تا مواد شیمیایی پایه را معامله می‌کنیم و یک زنجیره تامین قابل اعتماد برای شرکای خود تضمین می‌کنیم. تخصص ما در بازار به ما امکان می‌دهد تا در بازارهای پرنوسان حرکت کرده و به طور مداوم ارزش آفرینی کنیم.", "dept_food_full_desc": "در بخش مواد غذایی، ما بر تجارت جهانی کالاهای کشاورزی و محصولات غذایی با کیفیت بالا تمرکز داریم. ما کشاورزان و تولیدکنندگان را به بازارهای سراسر جهان متصل می‌کنیم و با مدیریت لجستیک و کنترل کیفیت، اطمینان می‌دهیم که هر محموله بالاترین استانداردهای ایمنی و تازگی را دارا باشد.", "contact_page_title": "با ما در تماس باشید", "our_address": "آدرس ما", "address_detail": "ایران، مشهد، بلوار جانباز، برج اداری پاژ ۲، طبقه ۳، واحد ۳۱۳", "call_us": "با ما تماس بگیرید", "phone_detail_1": "۵-۳۷۰۵۷۱۲۴-۰۵۱-۹۸+", "phone_detail_2": "۷۳۴۲-۳۰۲-۰۹۱۵-۹۸+", "phone_detail_3": "۱۴۶۶-۵۹۰-۰۹۱۵-۹۸+", "email_us": "ایمیل ما", "email_detail": "Mohajersteelco@gmail.com", "price_inquiry_title": "استعلام قیمت", "consultant_name_ali": "علی مهاجری", "consultant_title_ali": "مدیر فروش", "consultant_name_hashem": "هاشم مهاجری", "consultant_title_hashem": "مدیر عامل", "consultant_email_hashem": "mohajer90@yahoo.com", "request_quote_consultant": "درخواست قیمت", "products_page_title": "مجموعه کامل محصولات ما را مشاهده کنید", "product1_full_desc": "ورق‌های فولادی با کیفیت بالا در گریدها و ضخامت‌های مختلف، مناسب برای کاربردهای ساختمانی، خودروسازی و تولیدی. مهندسی شده برای دوام و عملکرد بالا.", "product2_full_desc": "تیرآهن‌های ساختمانی (تیرآهن I و H) با مقاومت و پشتیبانی فوق‌العاده برای پروژه‌های ساختمانی بزرگ. موجود در اندازه‌های استاندارد و سفارشی.", "product3_full_desc": "شمش‌های فولادی نیمه‌تمام، ایده‌آل برای نورد، آهنگری و سایر کاربردهای فرآوری. تولید شده با تکنولوژی ریخته‌گری پیشرفته برای کیفیت داخلی برتر.", "product4_full_desc": "نبشی‌های فولادی سبک و چندمنظوره برای قاب‌بندی، ساخت براکت و تقویت سازه‌ها. موجود در اندازه‌های بال مساوی و نامساوی برای نیازهای مختلف پروژه.", "product5_full_desc": "مجموعه جامعی از قطعات فولادی آماده مصرف، شامل ورق‌ها و میلگردها، که برای استفاده فوری در پروژه‌های شما برش خورده‌اند و باعث صرفه‌جویی در زمان و منابع می‌شوند.", "product6_full_desc": "پروفیل‌های مربع فولادی جوش داده شده با مقاومت بالا برای کاربردهای سازه‌ای و مکانیکی. دارای مقاومت پیچشی عالی و ظاهری تمیز و مدرن.", "product7_full_desc": "اسلب‌های فولادی نیمه‌تمام و سنگین، که عمدتاً برای تولید محصولات نورد تخت مانند ورق و کویل استفاده می‌شوند. اسلب‌های ما به دلیل ساختار یکنواخت و خلوص بالا شناخته شده‌اند.", "product8_full_desc": "میلگردهای تقویتی فولادی با مقاومت کششی بالا که برای تقویت و مسلح کردن سازه‌های بتنی استفاده می‌شوند. میلگردهای ما چسبندگی فوق‌العاده‌ای ایجاد کرده و در برابر خوردگی مقاوم هستند.", "analysis_grade": "گرید", "analysis_size": "سایز", "analysis_width": "عرض", "analysis_breath": "پهنا", "analysis_length": "طول", "steel_ready_lengths": "۶ میل تا ۱۲ میل", "request_quote": "درخواست قیمت", "hero_ingot": "شمش آهن", "hero_rebar": "میلگرد", "hero_slab": "اسلب", "hero_ingot_selector": "شمش آهن", "hero_rebar_selector": "میلگرد", "hero_slab_selector": "اسلب" },
    ar: { "nav_home": "الرئيسية", "nav_products": "المنتجات", "nav_departments": "الأقسام", "nav_about": "معلومات عنا", "nav_contact": "اتصل بنا", "nav_catalog": "مشاهدة الكتالوج", "products_title": "منتجاتنا", "specifications": "المواصفات", "view_details": "عرض التفاصيل", "product1_title": "ألواح الصلب", "product1_desc": "تجربة الجيل القادم.", "product2_title": "كمرات الصلب", "product2_desc": "تصميم أنيق، أداء قوي.", "product3_title": "عروق الصلب", "product3_desc": "ميزات متقدمة للمحترفين.", "product4_title": "زوايا الصلب", "product4_desc": "خفيف الوزن ومحمول.", "product5_title": "الصلب الجاهز", "product5_desc": "بأسعار معقولة مع الميزات الأساسية.", "product6_title": "أنابيب مربعة من الصلب", "product6_desc": "تم ترقيته بقدرات محسنة.", "product7_title": "ألواح الصلب", "product7_desc": "ألواح شديدة التحمل للإنشاءات الكبرى.", "product8_title": "حديد التسليح", "product8_desc": "قضبان التسليح للهياكل الخرسانية.", "manager1_name": "هاشم مهاجري", "manager1_title": "المدير العام", "manager1_desc": "بدأ هاشم مهاجري دوره كمدير عام لمجموعة مهاجر التجارية في عام 2019.", "manager2_name": "علي مهاجري", "manager2_title": "مدير مجموعة الصلب", "manager2_desc": "بدأت مسيرتها المهنية كمديرة لمجموعة مهاجر التجارية في عام 1989.", "reasons_prefix": "بعض الأسباب", "reasons_suffix": "لاختيارنا", "reason1_title": "فريق متخصص في شؤون التجارة الدولية", "reason1_desc": "يقدم فريقنا المتمرس إرشادات الخبراء وتنفيذًا سلسًا لجميع احتياجات التجارة الدولية الخاصة بك.", "reason2_title": "الالتزام بالمهنية والصدق والتوقيت الدقيق", "reason2_desc": "نحن نعمل بأعلى معايير النزاهة، مما يضمن عمليات شفافة وتسليمًا في الوقت المحدد.", "reason3_title": "شبكة واسعة من الشركاء التجاريين", "reason3_desc": "استفد من شبكتنا الواسعة من الشركاء الموثوق بهم لفتح فرص جديدة وتبسيط سلسلة التوريد الخاصة بك.", "learn_more": "اعرف المزيد", "departments_title": "أقسامنا", "dept_steel_title": "صلب", "dept_petro_title": "بتروكيماويات", "dept_food_title": "مواد غذائية", "dept_steel_desc": "الريادة في صناعة وإنتاج وتوزيع منتجات الصلب عالية الجودة...", "dept_petro_desc": "توفير مجموعة واسعة من المنتجات البتروكيماوية...", "dept_food_desc": "توفير وتجارة مجموعة متنوعة من المنتجات الغذائية...", "know_more": "اعرف المزيد", "about_page_title": "حول شركة مهاجر للصلب", "about_subtitle": "رواد مستقبل تجارة الصلب بالنزاهة والجودة والانتشار العالمي. اكتشف قصتنا والقيم التي تدفعنا إلى الأمام.", "intro_title": "مقدمة عن مجموعة مهاجر التجارية", "intro_text": "تأسست شركة مهاجر التجارية عام 1995 (1374 بالتقويم الفارسي) وفقًا لأهداف وسياسات الجمهورية الإسلامية الإيرانية الاقتصادية. تشمل أنشطة الشركة جميع أنواع الأنشطة الاقتصادية (الصناعية والإنتاجية والخدمية)، وخاصة التجارة، بما في ذلك الاستيراد والتصدير والترانزيت للشركات المحلية والأجنبية، لا سيما في السلع، إلى جانب الأنشطة التجارية والمجالات المربحة الأخرى بما في ذلك البتروكيماويات والصناعات ذات الصلة، والاستثمار والشراكة في الشركات والمشاريع التجارية. في عام 2018 (1397 بالتقويم الفارسي)، توسعت شركة مهاجر بتأسيس شركة مبين التجارية.", "dept_steel_full_desc": "قسم الصلب لدينا هو حجر الزاوية في أعمالنا. نحن متخصصون في توريد وتوزيع مجموعة شاملة من منتجات الصلب عالية الجودة، بما في ذلك الكتل، والألواح، والعوارض، والصفائح. بفضل شبكة عالمية قوية والالتزام بالتميز، نضمن التسليم في الوقت المناسب وأسعار تنافسية للمشاريع من أي حجم.", "dept_petro_full_desc": "يسد قسم البتروكيماويات لدينا الفجوة بين المنتجين والمستهلكين في الصناعة الكيميائية. نحن نتاجر في مجموعة واسعة من المنتجات، من البوليمرات الأساسية إلى المواد الكيميائية الأساسية، مما يضمن سلسلة توريد موثوقة لشركائنا. تتيح لنا خبرتنا في السوق التنقل في الأسواق المتقلبة وتقديم القيمة باستمرار.", "dept_food_full_desc": "في قسم المواد الغذائية، نركز على التجارة العالمية للسلع الزراعية والمنتجات الغذائية عالية الجودة. نحن نربط المزارعين والمنتجين بالأسواق في جميع أنحاء العالم، ونتولى الخدمات اللوجستية ومراقبة الجودة لضمان أن كل شحنة تلبي أعلى معايير السلامة والنضارة.", "contact_page_title": "ابقى على تواصل", "our_address": "عنواننا", "address_detail": "إيران، مشهد، شارع جانباز، برج پاژ الإداري ٢، الطابق ٣، الوحدة ٣١٣", "call_us": "اتصل بنا", "phone_detail_1": "٥-٣٧٠٥٧١٢٤-٠٥١-٩٨+", "phone_detail_2": "٧٣٤٢-٣٠٢-٠٩١٥-٩٨+", "phone_detail_3": "١٤٦٦-٥٩٠-٠٩١٥-٩٨+", "email_us": "راسلنا عبر البريد الإلكتروني", "email_detail": "Mohajersteelco@gmail.com", "price_inquiry_title": "استعلام عن الأسعار", "consultant_name_ali": "علي مهاجري", "consultant_title_ali": "مدير المبيعات", "consultant_name_hashem": "هاشم مهاجري", "consultant_title_hashem": "المدير العام", "consultant_email_hashem": "mohajer90@yahoo.com", "request_quote_consultant": "اطلب عرض سعر", "products_page_title": "استكشف مجموعتنا الكاملة من المنتجات", "product1_full_desc": "ألواح فولاذية عالية الجودة متوفرة بدرجات وسماكات مختلفة، مثالية لتطبيقات البناء والسيارات والتصنيع. مصممة للمتانة والأداء العالي.", "product2_full_desc": "عوارض فولاذية هيكلية (عوارض I و H) توفر قوة ودعمًا فائقين لمشاريع البناء واسعة النطاق. متوفرة بأحجام قياسية ومخصصة.", "product3_full_desc": "كتل صلب نصف مصنعة، مثالية للدرفلة والطرق وتطبيقات المعالجة الأخرى. منتجة بتقنية صب متقدمة لجودة داخلية فائقة.", "product4_full_desc": "زوايا فولاذية متعددة الاستخدامات وخفيفة الوزن للتأطير والأقواس والتعزيزات الهيكلية. متوفرة بأحجام أرجل متساوية وغير متساوية لتلبية احتياجات المشاريع المتنوعة.", "product5_full_desc": "مجموعة شاملة من مكونات الصلب الجاهزة للاستخدام، بما في ذلك الألواح والقضبان، مقطوعة حسب الحجم للنشر الفوري في مشاريعك، مما يوفر الوقت والموارد.", "product6_full_desc": "أنابيب مربعة فولاذية ملحومة عالية القوة للتطبيقات الهيكلية والميكانية. توفر قوة التوائية ممتازة وجمالية نظيفة وحديثة.", "product7_full_desc": "ألواح فولاذية نصف مصنعة شديدة التحمل، تستخدم بشكل أساسي لإنتاج المنتجات المدرفلة المسطحة مثل الألواح والملفات. تشتهر ألواحنا بهيكلها الموحد ونقاوتها.", "product8_full_desc": "قضبان تسليح فولاذية عالية الشد تستخدم لتقوية وتعزيز الهياكل الخرسانية. يوفر حديد التسليح لدينا ترابطًا فائقًا ومعالجًا لمقاومة التآكل.", "analysis_grade": "الدرجة", "analysis_size": "الحجم", "analysis_width": "العرض", "analysis_breath": "النفس", "analysis_length": "الطول", "steel_ready_lengths": "6 مم إلى 12 مم", "request_quote": "اطلب عرض سعر", "hero_ingot": "سبيكة حديد", "hero_rebar": "حديد التسليح", "hero_slab": "لوح", "hero_ingot_selector": "سبيكة حديد", "hero_rebar_selector": "حديد التسليح", "hero_slab_selector": "لوح" }
  };
  
  const setLanguage = (lang) => {
    document.documentElement.setAttribute('dir', (lang === 'fa' || lang === 'ar') ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
    document.querySelectorAll('[data-lang-key]').forEach(el => {
      const key = el.getAttribute('data-lang-key');
      if (translations[lang] && translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });
    if (currentLangSpan) {
        currentLangSpan.textContent = lang.toUpperCase();
    }
    localStorage.setItem('language', lang);
  };
  langLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const lang = link.getAttribute('data-lang');
      setLanguage(lang);
      if (languageSwitcher) languageSwitcher.classList.remove('open');
      if (langButton) langButton.setAttribute('aria-expanded', 'false');
    });
  });

  if (languageSwitcher) {
    languageSwitcher.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = languageSwitcher.classList.toggle('open');
      if (langButton) langButton.setAttribute('aria-expanded', isOpen);
    });
  }
  document.addEventListener('click', () => {
    if (languageSwitcher && languageSwitcher.classList.contains('open')) {
      languageSwitcher.classList.remove('open');
      if (langButton) langButton.setAttribute('aria-expanded', 'false');
    }
  });
  const savedLang = localStorage.getItem('language') || 'en';
  setLanguage(savedLang);

  // --- NEW HERO SECTION - Product Switcher Logic ---
  const newHeroSection = document.getElementById('new-hero-section');
  if (newHeroSection) {
      const productData = {
          ingot: { nameKey: 'hero_ingot', imageId: 'ingot-image' },
          rebar: { nameKey: 'hero_rebar', imageId: 'rebar-image' },
          slab: { nameKey: 'hero_slab', imageId: 'slab-image' }
      };
      const productNameEl = newHeroSection.querySelector('#product-name');
      const productDetailsEl = newHeroSection.querySelector('.product-details');
      const selectors = newHeroSection.querySelectorAll('.product-selector h2');
      const allImages = newHeroSection.querySelectorAll('.product-image');
      
      const updateProductDisplay = (productKey) => {
          const product = productData[productKey];
          if (!product) return;
          
          productDetailsEl.style.opacity = '0';
          productDetailsEl.style.transform = 'translate(-50%, -10%)';
          
          allImages.forEach(img => {
              img.classList.toggle('active', img.id === product.imageId);
          });
          
          setTimeout(() => {
              const currentLang = localStorage.getItem('language') || 'en';
              productNameEl.textContent = translations[currentLang][product.nameKey];
              productNameEl.dataset.langKey = product.nameKey;
              
              productDetailsEl.style.opacity = '1';
              productDetailsEl.style.transform = 'translate(-50%, -20%)';
          }, 300); 
      };
      
      selectors.forEach(selector => {
          selector.addEventListener('click', function() {
              if (this.classList.contains('active')) return;
              selectors.forEach(s => s.classList.remove('active'));
              this.classList.add('active');
              updateProductDisplay(this.dataset.product);
          });
      });
  }
});