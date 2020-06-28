export const constraints = {
  services: {
    name: {
      presence: {
        allowEmpty: false,
        message: '^الرجاء إدخال إسم '
      }
    },
    service: {
      presence: {
        allowEmpty: false,
        message: '^الرجاء اختيار نوع الخدمة المقدمة '
      }
    },
    city: {
      presence: {
        allowEmpty: false,
        message: '^رجاء اختر مدينة '
      }
    },
    tele: {
      presence: {
        allowEmpty: false,
        message: '^الرجاء إدخال رقم هاتف فعال'
      },
      numericality: {
        onlyInteger: true,
        message: '^الرجاء إدخال  رقم '
      },
      length: {
        is: 10,
        message: '^رقم الهاتف يجب أن يكون طوله عشرة أرقام '
      }
    }
  },
  login: {
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
    },
    confirmPassword: {
      equality: {
        attribute: 'password',
        message: '^ الرقمان السريان لا يتوافقان'
      }
    }
  }
};

export default constraints;
