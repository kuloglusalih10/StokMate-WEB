import * as Yup from "yup";

Yup.setLocale({
  mixed: {
    default: "Bu alan geçersiz.",
    required: "Bu alanı doldurmanız gerekiyor.",
    notNull: "Bu alan boş bırakılamaz.",
    oneOf: "Bu alan şu değerlerden biri olmalıdır: ${values}",
    notOneOf: "Bu alan şu değerlerden biri olmamalıdır: ${values}",
    notType: "Bu alan geçerli bir değer değil.",
    defined: "Bu alan tanımlı olmalıdır.",
  },
  string: {
    length: "Bu alan tam olarak ${length} karakter olmalıdır.",
    min: "Bu alan minimum ${min} karakter olmalıdır.",
    max: "Bu alan maksimum ${max} karakter olmalıdır.",
    matches: "Bu alan geçerli bir formatta olmalıdır.",
    email: "Geçerli bir e-posta adresi girin.",
    url: "Geçerli bir URL girmelisiniz.",
    uuid: "Geçerli bir UUID girmelisiniz.",
    trim: "Bu alan başında veya sonunda boşluk içermemelidir.",
    lowercase: "Bu alan küçük harflerden oluşmalıdır.",
    uppercase: "Bu alan büyük harflerden oluşmalıdır.",
  },
  number: {
    min: "Bu alan en az ${min} olmalıdır.",
    max: "Bu alan en fazla ${max} olmalıdır.",
    lessThan: "Bu alan ${less} değerinden küçük olmalıdır.",
    moreThan: "Bu alan ${more} değerinden büyük olmalıdır.",
    positive: "Bu alan pozitif bir sayı olmalıdır.",
    negative: "Bu alan negatif bir sayı olmalıdır.",
    integer: "Bu alan tam sayı olmalıdır.",
  },
  date: {
    min: "Bu tarih ${min} tarihinden sonra olmalıdır.",
    max: "Bu tarih ${max} tarihinden önce olmalıdır.",
  },
  boolean: {
    isValue: "Bu alanı işaretlemeniz gerekiyor.",
  },
  array: {
    min: "En az ${min} öğe seçmelisiniz.",
    max: "En fazla ${max} öğe seçebilirsiniz.",
    length: "Tam olarak ${length} öğe seçmelisiniz.",
  },
  object: {
    noUnknown: "Bu alan tanımsız anahtarlar içeremez.",
  },
});

export default Yup;
