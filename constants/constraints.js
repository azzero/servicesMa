export const constraints = {
  email: {
    presence: {
      allowEmpty: false,
      message: '^رجاء أدخل بريدك الإلكتروني '
    },
    email: {
      message: '^رجاء أدخل بريد الكتروني فعال'
    }
  },
  password: {
    presence: {
      allowEmpty: false,
      message: '^ادخال الرقم السري ضروري '
    },
    length: {
      minimum: 6,
      message: '^ الرقم السري يجب أن يتجاوز ستة أحرف'
    }
  }
};

export default constraints;
