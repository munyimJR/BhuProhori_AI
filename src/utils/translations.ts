import type { Language } from '../types';

export const TRANSLATIONS = {
  // Common Navigation
  nav: {
    home: { bn: 'হোমপেজ', en: 'Home' },
    upload: { bn: 'দলিল আপলোড', en: 'Deed Upload' },
    review: { bn: 'AI তথ্য যাচাই', en: 'AI Extraction' },
    identify: { bn: 'জমির নকশা', en: 'Cadastral GIS' },
    verify: { bn: 'যাচাইয়ের ফলাফল', en: 'Verification' },
    apply: { bn: 'নামজারি আবেদন', en: 'Apply Mutation' },
    officer: { bn: 'অফিসার ড্যাশবোর্ড', en: 'Officer Portal' },
    track: { bn: 'চূড়ান্ত রিপোর্ট', en: 'Status & Report' },
    servicesCaption: { bn: 'আপনার ভূমিসেবা', en: 'LAND SERVICES' },
    securityTitle: { bn: 'আপনার তথ্য, আপনার নিয়ন্ত্রণে', en: 'Your Data, Under Your Control' },
    securityDesc: {
      bn: 'এই ডিজাইনের সব ব্যক্তি, দলিল, খতিয়ান, দাগ ও নামজারি তথ্য সম্পূর্ণ কাল্পনিক। সরকারি সিস্টেমের সঙ্গে কোনো সংযোগ নেই।',
      en: 'All persons, deeds, khatians, plots, and mutation records here are synthetic demo data. Not linked to live gov systems.'
    },
    brandSub: { bn: 'ভূপ্রহরী • স্মার্ট ই-নামজারি', en: 'BhuProhori • Smart e-Mutation' },
  },

  // Topbar titles & breadcrumbs
  topbar: {
    pages: {
      '/': {
        title: { bn: 'হোমপেজ', en: 'Home' },
        subtitle: { bn: 'দলিল থেকে নামজারি — সহজ ৩ ধাপে', en: 'Deed to e-Mutation — in 3 Easy Steps' }
      },
      '/upload': {
        title: { bn: 'দলিল আপলোড', en: 'Deed Upload' },
        subtitle: { bn: 'কাগজের তথ্য হাতে না লিখে, একটি দলিল দিয়ে শুরু করুন', en: 'Start with a deed without manually typing paper details' }
      },
      '/review': {
        title: { bn: 'AI তথ্য যাচাই', en: 'AI Data Extraction' },
        subtitle: { bn: 'বাম পাশে নমুনা দলিল, ডানে সম্পাদনাযোগ্য তথ্য', en: 'Deed on the left, editable AI extracted data on the right' }
      },
      '/identify': {
        title: { bn: 'জমির নকশা', en: 'Parcel GIS Map' },
        subtitle: { bn: 'সাধারণ ব্যবহারকারীকে নকশায় জমি খুঁজতে হবে না', en: 'Interactive cadastral map with automatic parcel matching' }
      },
      '/verify': {
        title: { bn: 'যাচাইয়ের ফলাফল', en: 'Verification Engine' },
        subtitle: { bn: 'নামজারির আগে জমির পরিমাণ ও অধিকারের সত্যতা পরীক্ষা', en: 'Automated discrepancy, mortgage & encumbrance checking' }
      },
      '/apply': {
        title: { bn: 'নামজারি আবেদন', en: 'e-Mutation Application' },
        subtitle: { bn: 'আগের ধাপে নিশ্চিত করা তথ্য দিয়ে আবেদন প্রস্তুত', en: 'Auto-populated e-mutation form ready for citizen submission' }
      },
      '/officer': {
        title: { bn: 'অফিসার ড্যাশবোর্ড', en: 'Officer Dashboard' },
        subtitle: { bn: 'অনুমোদন ও পর্যালোচনা কর্মপ্রবাহের নমুনা', en: 'AC Land & Kanungo review, verification & approval workflow' }
      },
      '/track': {
        title: { bn: 'চূড়ান্ত রিপোর্ট', en: 'Status & Audit Report' },
        subtitle: { bn: 'আবেদন, নথি এবং যাচাইয়ের সারসংক্ষেপ এক জায়গায়', en: 'Application tracking, audit log, and certified summary' }
      },
      '/signin': {
        title: { bn: 'সাইন ইন ও একাউন্ট', en: 'Sign In & Account' },
        subtitle: { bn: 'নাগরিক ও কর্মকর্তা পোর্টাল — ১-ক্লিক ডেমো এক্সেস', en: 'Citizen & Officer Portals — 1-Click Showcase Demo' }
      },
    },
    defaultTitle: { bn: 'ভূপ্রহরী AI', en: 'BhuProhori AI' },
    defaultSubtitle: { bn: 'স্মার্ট নামজারি প্ল্যাটফর্ম', en: 'Smart Land Mutation System' },
    citizenRole: { bn: 'নাগরিক', en: 'Citizen' },
    officerRole: { bn: 'কর্মকর্তা', en: 'Officer' },
    switchRoleTip: { bn: 'মোড পরিবর্তন করুন', en: 'Switch User Mode' },
    interactiveDemo: { bn: 'ইন্টার‌্যাক্টিভ ডেমো', en: 'Interactive Demo' },
    userTooltip: {
      bn: 'বর্তমান ইউজার: ',
      en: 'Current role: '
    },
    signInBtn: { bn: 'সাইন ইন', en: 'Sign In' },
    signOutBtn: { bn: 'লগ আউট', en: 'Sign Out' },
    languageLabel: { bn: 'ভাষা', en: 'Language' },
    banglaShort: { bn: 'বাং', en: 'বাং' },
    englishShort: { bn: 'EN', en: 'EN' },
    toggleLanguageTip: { bn: 'Switch to English', en: 'বাংলায় দেখুন' }
  },

  // Common UI actions
  common: {
    next: { bn: 'পরবর্তী ধাপ', en: 'Next Step' },
    prev: { bn: 'আগের ধাপ', en: 'Previous Step' },
    submit: { bn: 'আবেদন জমা দিন', en: 'Submit Application' },
    confirm: { bn: 'নিশ্চিত করুন', en: 'Confirm' },
    cancel: { bn: 'বাতিল', en: 'Cancel' },
    save: { bn: 'সংরক্ষণ করুন', en: 'Save' },
    edit: { bn: 'সম্পাদনা করুন', en: 'Edit' },
    close: { bn: 'বন্ধ করুন', en: 'Close' },
    downloadPdf: { bn: 'PDF ডাউনলোড', en: 'Download PDF' },
    print: { bn: 'প্রিন্ট করুন', en: 'Print Report' },
    copyId: { bn: 'কপি করুন', en: 'Copy ID' },
    sample: { bn: 'নমুনা', en: 'Sample' },
    verified: { bn: 'যাচাইকৃত', en: 'Verified' },
    warning: { bn: 'সতর্কতা', en: 'Warning' },
    error: { bn: 'ত্রুটি', en: 'Error' },
  },

  // HomePage Strings
  home: {
    welcomeLine: { bn: 'ভূমির তথ্য থেকে আবেদনের প্রস্তুতি', en: 'From Land Deed to e-Mutation Readiness' },
    hackathonTag: 'LANDTECH INNOVATION · 2026',
    heroH1Pre: { bn: 'জমির নামজারি,', en: 'Land Mutation,' },
    heroH1Bold: { bn: 'এবার আরও সহজ।', en: 'Now Simpler Than Ever.' },
    heroDesc: {
      bn: 'আপনার দলিল আপলোড করুন। প্রয়োজনীয় তথ্য যাচাই করুন। সহজেই নামজারির আবেদন প্রস্তুত করুন।',
      en: 'Upload your deed. Cross-verify critical land records. Seamlessly prepare your e-mutation application in minutes.'
    },
    startWithDeed: { bn: 'দলিল দিয়ে শুরু করুন', en: 'Start With Deed' },
    trySample: { bn: 'নমুনা দিয়ে দেখুন', en: 'Try Demo Sample' },
    noServerNote: {
      bn: 'কোনো ফাইল সার্ভারে পাঠানো হয় না · শুধুমাত্র ডেমো',
      en: 'Zero server uploads · Client-side privacy-first demo'
    },
    photoCredit: { bn: 'AI-নির্মিত ধানক্ষেতের দৃশ্য', en: 'AI-rendered Paddy Field' },
    growthLabel: { bn: 'সবুজ থেকে সোনালি', en: 'Green to Golden Harvest' },
    plotPreviewTitle: { bn: 'আপনার জমির পরিচিতি', en: 'Your Land Identity' },
    plotPreviewSub: { bn: 'ডেমো মৌজা · আরএস জরিপ', en: 'Demo Mouza · RS Survey' },
    dagNo: { bn: 'দাগ নম্বর', en: 'Plot / Dag No.' },
    khatianNo: { bn: 'খতিয়ান', en: 'Khatian No.' },
    landArea: { bn: 'জমির পরিমাণ', en: 'Land Area' },
    decimalUnit: { bn: 'শতাংশ', en: 'Decimals' },
    viewSampleMap: { bn: 'নমুনা নকশা দেখুন', en: 'View Sample Map' },

    sectionTitle: { bn: 'আপনি কী করতে চান?', en: 'What would you like to do?' },
    sectionSub: { bn: 'আপনার প্রয়োজন অনুযায়ী শুরু করুন', en: 'Choose your workflow to explore the system' },

    service1Title: { bn: 'দলিল আপলোড করুন', en: 'Upload Land Deed' },
    service1Desc: {
      bn: 'ছবি বা PDF দিয়ে শুরু করুন। নমুনা তথ্য থেকে আবেদনের ধাপগুলো দেখুন।',
      en: 'Start with deed image or PDF. Follow step-by-step smart mutation workflow.'
    },
    service1Action: { bn: 'শুরু করার সহজ উপায়', en: 'Easiest way to begin' },

    service2Title: { bn: 'জমির তথ্য দেখুন', en: 'Inspect Cadastral Map' },
    service2Desc: {
      bn: 'নমুনা দাগ, খতিয়ান ও মৌজা নকশায় জমির পরিচিতি মিলিয়ে নিন।',
      en: 'Locate plots on interactive GIS maps and check digitized boundary overlays.'
    },
    service2Action: { bn: 'নমুনা নকশা খুলুন', en: 'Open sample map' },

    service3Title: { bn: 'আবেদনের অবস্থা দেখুন', en: 'Track Application Status' },
    service3Desc: {
      bn: 'ডেমো আবেদনের অগ্রগতি ও যাচাইয়ের সারসংক্ষেপ এক জায়গায় দেখুন।',
      en: 'View end-to-end audit trail, officer decisions, and verification certificate.'
    },
    service3Action: { bn: 'ডেমো রিপোর্ট দেখুন', en: 'View demo report' },

    storyTitle: { bn: 'সবুজে শুরু। সোনালিতে প্রস্তুতি।', en: 'Started in Green. Harvested in Gold.' },
    storyDesc: {
      bn: 'ধানের বেড়ে ওঠার রঙে, দলিল থেকে আবেদনের পথ।',
      en: 'Inspired by the ripening paddy cycle — transforming raw deeds into verified land ownership.'
    },
    storyStep1: { bn: 'শুরু', en: 'Start' },
    storyStep2: { bn: 'যাচাই', en: 'Verify' },
    storyStep3: { bn: 'প্রস্তুতি', en: 'Ready' },

    howTitlePre: { bn: 'দলিল থেকে আবেদন।', en: 'From Deed to Application.' },
    howTitleBold: { bn: 'সহজ তিনটি ধাপে।', en: 'In 3 Simple Steps.' },
    howSub: { bn: 'প্রতিটি ধাপে তথ্য দেখুন, বুঝুন ও নিশ্চিত করুন।', en: 'Review, verify, and confirm details at each milestone.' },
    step1Title: { bn: 'দলিল দিন', en: 'Upload Deed' },
    step1Desc: { bn: 'ছবি, PDF অথবা নমুনা দলিল বেছে নিন।', en: 'Select deed photo, scan, or preset scenario.' },
    step2Title: { bn: 'তথ্য যাচাই করুন', en: 'Verify Data' },
    step2Desc: { bn: 'দলিলের তথ্য ও জমির পরিচিতি মিলিয়ে নিন।', en: 'Cross-check deed claims with official GIS records.' },
    step3Title: { bn: 'আবেদন প্রস্তুত করুন', en: 'Submit Mutation' },
    step3Desc: { bn: 'তথ্য নিশ্চিত করে ডেমো আবেদন তৈরি করুন।', en: 'Confirm verified details and generate application.' },

    scenariosTitle: { bn: 'হ্যাকাথন মূল্যায়ন পরিস্থিতি (৮টি নমুনা কেস)', en: 'Hackathon Evaluation Scenarios (8 Test Cases)' },
    scenariosSub: { bn: 'যেকোনো একটি নির্বাচন করে সরাসরি AI ও GIS ফলাফল পরীক্ষা করুন', en: 'Select any case to test real-time AI extraction and GIS risk engine' },

    scenarios: [
      {
        id: 1,
        title: { bn: '১. সম্পূর্ণ সঠিক দলিল ও রেকর্ড (Clean Match)', en: '1. Clean Match — Fully Valid Deed & Records' },
        desc: { bn: 'সব তথ্য মিলে যায়, কোনো বিবাদ নেই, পূর্ণ অধিকার বিদ্যমান।', en: 'All data points match perfectly. Full ownership rights intact.' },
      },
      {
        id: 2,
        title: { bn: '২. একাধিক মালিক ও অংশ বিক্রয় (Multiple Owners)', en: '2. Multiple Co-Owners & Partial Sale' },
        desc: { bn: 'খতিয়ানে একাধিক শরিক, নির্দিষ্ট অংশের বৈধ সীমানা যাচাই।', en: 'Khatian contains multiple sharers; fractional share boundary check.' },
      },
      {
        id: 3,
        title: { bn: '৩. ব্যাংকে বন্ধক রাখা জমি (Mortgage Warning)', en: '3. Encumbrance / Bank Mortgage Warning' },
        desc: { bn: 'জমিটির উপর রাষ্ট্রায়ত্ত ব্যাংকের লিয়েন/বন্ধক বিদ্যমান।', en: 'A nationalized commercial bank lien exists against this parcel.' },
      },
      {
        id: 4,
        title: { bn: '৪. আদালতে মামলা ও স্থগিতাদেশ (Legal Injunction)', en: '4. Civil Court Litigation & Injunction' },
        desc: { bn: 'জমিটির উপর দেওয়ানি আদালতের নিষেধাজ্ঞা বিদ্যমান।', en: 'Ongoing civil suit with temporary injunction barring mutation.' },
      },
      {
        id: 5,
        title: { bn: '৫. অর্পিত / খাস সরকারি জমি (Khas Land Alert)', en: '5. Vested / Khas Government Land Alert' },
        desc: { bn: 'সরকারি ১নং খাস খতিয়ানভুক্ত জমি বিক্রির চেষ্টা শনাক্ত।', en: 'Attempted conveyance of protected Gov Khas Khatian #1 detected.' },
      },
      {
        id: 6,
        title: { bn: '৬. জমির পরিমাণের অসামঞ্জস্য (Area Mismatch)', en: '6. Land Area Mismatch Discrepancy' },
        desc: { bn: 'দলিলে ১০ শতাংশ দাবি, কিন্তু বিক্রেতার রেকর্ডে আছে ৮ শতাংশ।', en: 'Deed claims 10 decimals, but seller khatian only holds 8 decimals.' },
      },
      {
        id: 7,
        title: { bn: '৭. সাব-রেজিস্ট্রার অফিসের তথ্যে অমিল', en: '7. Sub-Registrar Deed Archive Mismatch' },
        desc: { bn: 'দলিল নম্বর সাব-রেজিস্ট্রি আর্কাইভের মূল বহির সাথে অমিল।', en: 'Deed volume and registration number mismatch in registry records.' },
      },
      {
        id: 8,
        title: { bn: '৮. জলাশয় / শ্রেণি পরিবর্তন সতর্কতা', en: '8. Wetland / Environmental Classification Alert' },
        desc: { bn: 'জমির শ্রেণি জলাশয়/নদীগর্ভ, ভরাট ও মিউটেশন আইনত সীমাবদ্ধ।', en: 'Wetland/riverbed land class. Illegal conversion prohibited by law.' },
      },
    ],

    transparencyTitle: { bn: 'স্বচ্ছতা থেকেই আস্থা।', en: 'Transparency Fosters Trust.' },
    transparencyDesc: {
      bn: 'এটি একটি হ্যাকাথন প্রোটোটাইপ। সব রেকর্ড কাল্পনিক; কোনো সরকারি সিস্টেমে আবেদন জমা হয় না।',
      en: 'This is a hackathon innovation prototype. All records are fictional; no filings are submitted to live gov registries.'
    },
  },

  // Cadastral GIS Map (Identify) Page
  gisMap: {
    pageTitle: { bn: 'স্মার্ট ক্যাডাস্ট্রাল ভূমি নকশা', en: 'Smart Cadastral Land GIS' },
    pageSubtitle: {
      bn: 'ভূমি মন্ত্রণালয় ও জাতীয় ক্যাডাস্ট্রাল স্ট্যান্ডার্ড অনুযায়ী দলিলের তথ্যের সাথে দাগ ও মৌজা নকশার সরাসরি স্বয়ংক্রিয় সিঙ্ক।',
      en: 'Direct automated sync between deed records and cadastral plot maps aligned with Ministry of Land standards.'
    },
    badge: { bn: 'ভূমি নকশা জিআইএস', en: 'Cadastral GIS' },
    tabLiveGov: { bn: '🏛️ সরকারি লাইভ ভূমি নকশা (Live National Portal)', en: '🏛️ Live National Portal (map.land.gov.bd)' },
    tabAiOverlay: { bn: '🤖 AI পার্সেল সিঙ্ক ও স্যাটেলাইট', en: '🤖 AI Parcel Sync & Satellite' },
    livePortalConnected: { bn: 'লাইভ সরকারি সার্ভার সংযুক্ত (৬৪ জেলা সম্পূর্ণ কার্যকর)', en: 'Live Gov Server Active (All 64 Districts)' },
    floatingCardTitle: { bn: 'ভূপ্রহরী AI — দলিল পার্সেল সিঙ্ক', en: 'BhuProhori AI — Deed Parcel Sync' },
    floatingCardSub: { bn: 'আপলোডকৃত দলিলের সাথে প্রস্তুতকৃত তথ্য', en: 'Verified records from uploaded deed' },
    copyDeedDag: { bn: 'দলিলের দাগ কপি করুন', en: 'Copy Deed Dag No.' },
    searchHintBanner: {
      bn: '💡 জাতীয় ভূমি নকশা পোর্টাল: বাংলাদেশের যেকোনো বিভাগ, জেলা, উপজেলা, মৌজা ও দাগ নম্বর সরাসরি অনুসন্ধান করতে পারেন।',
      en: '💡 Fully functional nationwide cadastral portal: search any division, district, upazila, mouza, and plot across Bangladesh.'
    },
    division: { bn: 'বিভাগ', en: 'Division' },
    district: { bn: 'জেলা', en: 'District' },
    upazila: { bn: 'উপজেলা/থানা', en: 'Upazila' },
    mouza: { bn: 'মৌজা', en: 'Mouza' },
    dag: { bn: 'দাগ নম্বর', en: 'Dag / Plot' },
    searchBtn: { bn: 'প্লট খুঁজুন', en: 'Locate Plot' },
    syncDeedBtn: { bn: 'দলিলের তথ্যে সিঙ্ক', en: 'Auto-Sync Deed' },
    resetBtn: { bn: 'রিসেট', en: 'Reset' },
    basemapStreet: { bn: '🗺️ রাস্তা ও মৌজা', en: '🗺️ Street Cartography' },
    basemapSatellite: { bn: '🛰️ স্যাটেলাইট ভিউ', en: '🛰️ High-Res Satellite' },
    legendSelected: { bn: 'দলিলভুক্ত দাগ', en: 'Deed Plot' },
    legendAdjacent: { bn: 'পার্শ্ববর্তী দাগ', en: 'Adjacent Plots' },
    govStandardPill: { bn: 'ভূমি নকশা স্ট্যান্ডার্ড (map.land.gov.bd)', en: 'Gov Cadastral Standard (map.land.gov.bd)' },
    openOfficialPortal: { bn: 'অফিসিয়াল পোর্টালে ক্রস-চেক ↗', en: 'Cross-Check Official Portal ↗' },
    plotClass: { bn: 'জমির শ্রেণি', en: 'Land Classification' },
    plotClassVal: { bn: 'নাল জমি (কৃষি)', en: 'Nal / Agricultural Land' },
    coordinates: { bn: 'জিআইএস স্থানাঙ্ক', en: 'GIS Coordinates' },
    noBoundaryDispute: { bn: 'কোনো সীমানা বিরোধ বা ওভারল্যাপিং নেই', en: 'No boundary overlaps or cadastral disputes detected' },
    quickSelectHint: { bn: '💡 সরাসরি ম্যাপের যেকোনো দাগে ক্লিক করে তথ্য পরিবর্তন বা যাচাই করতে পারেন।', en: '💡 Click any plot directly on the map to inspect ownership and specifications.' },
    matchedTitle: { bn: 'সম্ভাব্য জমি পাওয়া গেছে', en: 'Potential Land Parcel Identified' },
    matchedSub: { bn: 'দলিলের সঙ্গে মিলিয়ে দেখুন', en: 'Cross-verify with deed records' },
    parcelDetails: { bn: 'নির্বাচিত জমির বিবরণ', en: 'Selected Plot Specifications' },
    sampleMatch: { bn: 'দলিলের সাথে নিখুঁত মিল', en: 'Deed Matched' },
    manualSelect: { bn: 'ম্যানুয়াল নির্বাচন', en: 'Manual Selection' },
    dagNo: { bn: 'দাগ নম্বর', en: 'Dag Number' },
    survey: { bn: 'জরিপ', en: 'Survey Type' },
    recordedArea: { bn: 'রেকর্ডকৃত প্লটের পরিমাণ', en: 'Recorded Plot Area' },
    khatian: { bn: 'খতিয়ান', en: 'Khatian' },
    recordedOwner: { bn: 'রেকর্ডকৃত মালিক', en: 'Recorded Owner' },
    decimals: { bn: 'শতাংশ', en: 'Decimals' },
    disclaimer: {
      bn: 'নকশার চিত্রটি শুধু জমি শনাক্ত করার সহায়ক। এটি নিজে মালিকানা প্রমাণ করে না।',
      en: 'The cadastral map view is an identification aid only and does not independently confer legal title.'
    },
    proceedVerify: { bn: 'যাচাইয়ের ফলাফল দেখুন →', en: 'View Verification Results →' },
    backReview: { bn: 'তথ্য পর্যালোচনায় ফিরুন', en: 'Return to Review' }
  },

  // Authentication & Demo Sign In
  auth: {
    showcaseTitle: { bn: '🏆 হ্যাকাথন শোকেস ১-ক্লিক ডেমো এক্সেস', en: '🏆 Hackathon Showcase 1-Click Demo Access' },
    showcaseSub: {
      bn: 'বিচারক ও মূল্যায়কদের সুবিধার জন্য পাসওয়ার্ড ছাড়া সরাসরি ডেমো প্রোফাইলে প্রবেশ করুন।',
      en: 'Instant 1-click evaluation access with pre-configured personas for judges & evaluators.'
    },
    demoCitizenTitle: { bn: '১-ক্লিক ডেমো নাগরিক সাইন ইন', en: '1-Click Demo Citizen Sign In' },
    demoCitizenSubtitle: { bn: 'মোঃ রফিকুল ইসলাম (নাগরিক আবেদনকারী)', en: 'Md. Rafiqul Islam (Citizen Applicant)' },
    demoCitizenDetails: { bn: 'এনআইডি: ১৯৮৮২৬৯২৫১০০০০০১২৩ · মোবাইল: ০১৭১১-২৩৪৫৬৭', en: 'NID: 19882692510000123 · Mobile: 01711-234567' },
    demoOfficerTitle: { bn: '১-ক্লিক ডেমো কর্মকর্তা সাইন ইন', en: '1-Click Demo Officer Sign In' },
    demoOfficerSubtitle: { bn: 'তাহমিনা আক্তার — সহকারী কমিশনার (ভূমি)', en: 'Tahmina Akhter — Assistant Commissioner (Land)' },
    demoOfficerDetails: { bn: 'আইডি: AC-LAND-SAVAR-04 · সাভার উপজেলা রাজস্ব সার্কেল, ঢাকা', en: 'Gov ID: AC-LAND-SAVAR-04 · Savar Circle, Dhaka' },
    citizenTab: { bn: 'নাগরিক পোর্টাল', en: 'Citizen Portal' },
    officerTab: { bn: 'কর্মকর্তা পোর্টাল', en: 'Officer Portal' },
    signInTab: { bn: 'সাইন ইন (লগইন)', en: 'Sign In (Login)' },
    signUpTab: { bn: 'নতুন নিবন্ধন (সাইন আপ)', en: 'Sign Up (Register)' },
    citizenSignInHead: { bn: 'নাগরিক একাউন্টে প্রবেশ', en: 'Citizen Portal Sign In' },
    citizenSignInDesc: { bn: 'জাতীয় পরিচয়পত্র বা মোবাইল নম্বর দিয়ে প্রবেশ করুন', en: 'Sign in with your National ID or registered mobile' },
    officerSignInHead: { bn: 'ভূমি প্রশাসন কর্মকর্তা প্রবেশ', en: 'Land Administration Officer Sign In' },
    officerSignInDesc: { bn: 'সরকারি ই-নথি বা কর্মকর্তা পরিচিতি নম্বর দিয়ে প্রবেশ করুন', en: 'Sign in with your Gov e-Nothi or Officer ID' },
    nidOrPhone: { bn: 'এনআইডি (১০/১৭ ডিজিট) বা মোবাইল নম্বর', en: 'National ID (10/17 digit) or Mobile' },
    password: { bn: 'পাসওয়ার্ড', en: 'Password' },
    govId: { bn: 'সরকারি কর্মকর্তা আইডি / সার্ভিস নম্বর', en: 'Gov Official ID / Service Number' },
    designation: { bn: 'অফিসিয়াল পদবি', en: 'Official Designation' },
    acLand: { bn: 'সহকারী কমিশনার (ভূমি) / AC Land', en: 'Assistant Commissioner (Land) / AC Land' },
    kanungo: { bn: 'কানুনগো / Kanungo', en: 'Kanungo / Revenue Officer' },
    surveyor: { bn: 'সার্ভেয়ার / ইউনিয়ন ভূমি সহকারী কর্মকর্তা', en: 'Surveyor / Union Land Sub-Officer' },
    fullName: { bn: 'পূর্ণ নাম (জাতীয় পরিচয়পত্র অনুযায়ী)', en: 'Full Name (as per NID)' },
    confirmPassword: { bn: 'পাসওয়ার্ড নিশ্চিত করুন', en: 'Confirm Password' },
    district: { bn: 'জেলা', en: 'District' },
    upazila: { bn: 'উপজেলা', en: 'Upazila' },
    rememberMe: { bn: 'আমাকে মনে রাখুন', en: 'Remember me on this browser' },
    forgotPassword: { bn: 'পাসওয়ার্ড ভুলে গেছেন?', en: 'Forgot password?' },
    submitSignIn: { bn: 'সাইন ইন করুন', en: 'Sign In Now' },
    submitSignUp: { bn: 'একাউন্ট তৈরি করুন', en: 'Create Account' },
    noAccountPrompt: { bn: 'কোনো একাউন্ট নেই?', en: "Don't have an account?" },
    hasAccountPrompt: { bn: 'ইতিমধ্যে একাউন্ট আছে?', en: 'Already have an account?' },
    createAccountLink: { bn: 'নতুন একাউন্ট খুলুন', en: 'Create an account' },
    signInLink: { bn: 'লগইন করুন', en: 'Sign in here' },
    demoNotice: {
      bn: '💡 এটি ল্যান্ডটেক হ্যাকাথন ২০২৬ এর প্রোটোটাইপ। দ্রুত মূল্যায়নের জন্য উপরের ১-ক্লিক ডেমো বাটন ব্যবহার করুন।',
      en: '💡 This is a LandTech Hackathon 2026 prototype. Use the 1-Click Demo buttons above for instant access.'
    }
  },

  // Footer
  footer: {
    text: {
      bn: '© ভূপ্রহরী AI — ল্যান্ডটেক ইনোভেশন হ্যাকাথন ২০২৬। ভূ-স্থানিক স্মার্ট ই-নামজারি ও জমি যাচাইকরণ ব্যবস্থা।',
      en: '© BhuProhori AI — LandTech Innovation Hackathon 2026. Geo-Integrated Smart e-Mutation & Land Verification System.'
    }
  }
};

/**
 * Helper to get a translation string safely.
 */
export function t<T extends { bn: string; en: string }>(item: T, lang: Language): string {
  return item[lang] || item['bn'];
}
