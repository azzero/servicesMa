import { Dimensions } from 'react-native';
export const screenWidth = Math.round(Dimensions.get('window').width);
export const screenHeight = Math.round(Dimensions.get('window').height);
//colors
export const PrimaryColor = '#003049';
export const PrimaryColorGradient = '#006396';
export const SecondColor = '#F77F00';
export const thirdColor = '#D62828';
export const fourthColor = '#FCBF49';
export const fifthColor = '#EAE2B7';
export const grayColor = '#9DA3B4';
export const white = '#ffffff';
export const GreenLiteColor = '#799f0c';
export const facebookColor = '#4267B2';
export const black = '#000000';

//fonts
export const PrimaryFont = 'openSans';
export const BoldFont = 'openSansBold';
export const MaghribiFont = 'MaghribiFont';
export const ShebaYeFont = 'ShebaYeFont';
// sizes
export const sizes = {
  base: 16,
  title: 18,
  h1: 26,
  h2: 20,
  h3: 18,
  header: 16,
  body: 14
};
// cities :
export const MoroccoCities = [
  { value: 'الرباط' },
  { value: 'سلا' },
  { value: 'الخميسات' },
  { value: 'تيفلت' },
  { value: 'الرماني' },
  { value: 'والماس' },
  { value: 'بوزنيقة' },
  { value: 'القنيطرة' },
  { value: 'سيدي قاسم' },
  { value: 'سيدي يحيى الغرب' },
  { value: 'سيدي سليمان' },
  { value: 'سوق أربعاء الغرب' },
  { value: 'عرباوة' },
  { value: 'مولاي بوسلهام' },
  { value: 'الدار البيضاء' },
  { value: 'المحمدية' },
  { value: 'بن سليمان' },
  { value: 'سطات' },
  { value: 'الكارة' },
  { value: 'البروج' },
  { value: 'ابن أحمد' },
  { value: 'برشيد' },
  { value: 'الجديدة' },
  { value: 'أزمور' },
  { value: 'سيدي بنور' },
  { value: 'خميس الزمامرة' },
  { value: 'بني ملال' },
  { value: 'خنيفرة' },
  { value: 'مولاي بوعزة' },
  { value: 'زاوية أحنصال' },
  { value: 'أزيلال' },
  { value: 'الفقيه بنصالح' },
  { value: 'دمنات' },
  { value: 'القصيبة' },
  { value: 'قصبة تادلة' },
  { value: 'خريبكة' },
  { value: 'وادي زم' },
  { value: 'مراكش' },
  { value: 'قلعة السراغنة' },
  { value: 'الصويرة' },
  { value: 'شيشاوة' },
  { value: 'بنجرير' },
  { value: 'الرحامنة' },
  { value: 'تمنار' },
  { value: 'اسفي' },
  { value: 'الوليدية' },
  { value: 'اليوسفية' },
  { value: 'تسلطانت' },
  { value: 'تامصلوحت' },
  { value: 'قطارة' },
  { value: 'كلميم' },
  { value: 'أسا' },
  { value: 'الزاك' },
  { value: 'طانطان' },
  { value: 'سيدي إفني' },
  { value: 'طنجة' },
  { value: 'تطوان' },
  { value: 'العرائش' },
  { value: 'أصيلة' },
  { value: 'شفشاون' },
  { value: 'مرتيل' },
  { value: 'المضيق' },
  { value: 'القصر الكبير' },
  { value: 'القصر الصغير' },
  { value: 'الحسيمة' },
  { value: 'سبتة' },
  { value: 'الفنيدق' },
  { value: 'الجبهة' },
  { value: 'واد لاو' },
  { value: 'باب برد' },
  { value: 'وزان' },
  { value: 'بوسكور' },
  { value: 'وجدة' },
  { value: 'بركان' },
  { value: 'فكيك' },
  { value: 'بوعرفة' },
  { value: 'كرسيف' },
  { value: 'جرادة' },
  { value: 'عين الشعير' },
  { value: 'تاوريرت' },
  { value: 'الناظور' },
  { value: 'دبدو' },
  { value: 'سلوان' },
  { value: 'بني أنصار' },
  { value: 'فرخانة' },
  { value: 'تالسينت' },
  { value: 'تندرارة' },
  { value: 'العيون الشرقية' },
  { value: 'بني ادرار' },
  { value: 'السعيدية' },
  { value: 'رأس الماء' },
  { value: 'تافوغالت' },
  { value: 'فزوان' },
  { value: 'أحفير' },
  { value: 'زايو' },
  { value: 'دريوش' },
  { value: 'بني تجيت' },
  { value: 'بوعنان' },
  { value: 'فاس' },
  { value: 'صفرو' },
  { value: 'مولاي يعقوب' },
  { value: 'بولمان' },
  { value: 'ميسور' },
  { value: 'رباط الخير' },
  { value: 'المنزل بني يازغة' },
  { value: 'إموزار كندر' },
  { value: 'تازة' },
  { value: 'تاونات' },
  { value: 'أكنول' },
  { value: 'تيزي وسلي' },
  { value: 'بورد' },
  { value: 'تاهلة' },
  { value: 'تيسة' },
  { value: 'قرية با محمد' },
  { value: 'كتامة' },
  { value: 'واد أمليل' },
  { value: 'مكناس' },
  { value: 'يفرن' },
  { value: 'الحاجب' },
  { value: 'زرهون' },
  { value: 'آزرو' },
  { value: 'الرشيدية' },
  { value: 'الريصاني' },
  { value: 'أرفود' },
  { value: 'تنديت' },
  { value: 'كلميمة' },
  { value: 'إملشيل' },
  { value: 'تنجداد' },
  { value: 'الريش' },
  { value: 'ميدلت' },
  { value: 'زاكورة' },
  { value: 'ورزازات' },
  { value: 'تنغير' },
  { value: 'هسكورة' },
  { value: 'قلعة مكونة' },
  { value: 'أكدز' },
  { value: 'بومالن دادس' },
  { value: 'النيف' },
  { value: 'أسول' },
  { value: 'أمسمرير' },
  { value: 'تازارين' },
  { value: 'أكادير' },
  { value: 'تارودانت' },
  { value: 'تزنيت' },
  { value: 'إغرم' },
  { value: 'تالوين' },
  { value: 'تافراوت' },
  { value: 'طاطا' },
  { value: 'أقا' },
  { value: 'فم لحصن' },
  { value: 'بويكرة' },
  { value: 'أولاد تايمة' },
  { value: 'العيون' },
  { value: 'بوجدور' },
  { value: 'طرفاية' },
  { value: 'السمارة' },
  { value: 'الداخلة' },
  { value: 'أوسرد' },
  { value: 'بويزكارن' },
  { value: 'بوكراع' },
  { value: 'تفاريتي' },
  { value: 'المحبس' },
  { value: 'الكويرة' }
];
export const services = [
  // حرف رجالية
  {
    value: 'كهربائي'
  },
  {
    value: 'ميكانيكي'
  },
  {
    value: 'بلومبيي'
  },
  {
    value: 'نجار'
  },
  {
    value: 'حداد'
  },
  {
    value: 'صباغ'
  },
  {
    value: 'بناء'
  },
  {
    value: 'حارس'
  },
  {
    value: 'اسكافي'
  },
  {
    value: 'خياط'
  },

  {
    value: 'جباس'
  },
  {
    value: 'تغليف الأرضية والجدران'
  },
  {
    value: 'جاردينيي'
  },
  {
    value: 'مصلح دراجات النارية'
  },
  {
    value: 'مصلح آلات منزلية'
  },
  {
    value: 'كراء السيارات '
  },
  // مهن قضائية
  {
    value: 'مفوض قضائي'
  },
  {
    value: 'عدول'
  },
  {
    value: 'موثق'
  },
  {
    value: 'مستشار قانوني'
  },
  // خدمات نسائية
  {
    value: 'عاملة بيت'
  },
  {
    value: 'مربية منزلية'
  },
  {
    value: ' طباخة منزلية'
  },
  {
    value: 'بائعة حلويات'
  },
  // طب وصحة
  {
    value: 'ممرض خاص'
  },
  {
    value: 'طبيب خاص'
  },
  {
    value: 'مدرب خاص'
  },
  // تقنيات و حواسيب
  {
    value: 'إصلاح الحواسيب'
  },
  {
    value: 'تقني هواتف'
  },
  {
    value: 'مصمم'
  },
  {
    value: 'مطور مواقع'
  },
  {
    value: 'مسوق إلكتروني'
  },
  {
    value: 'مستشار معلوماتي '
  },
  //  ثقافة وتعليم
  {
    value: 'أستاذ خاص'
  },
  {
    value: 'مترجم'
  },
  // اقتصاد
  {
    value: 'محاسب'
  },
  {
    value: 'طبوغراف'
  },
  {
    value: 'منظم حفلات'
  },
  {
    value: 'أخرى'
  }
];
