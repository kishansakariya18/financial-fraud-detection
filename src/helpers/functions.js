import moment from 'moment-timezone';

export function getDateInUTCToTimeZone(
  date,
  timeZone = getTimezone(),
  dateFormat = 'DD MMM YYYY hh:mm A'
) {
  return moment.utc(date).tz(timeZone).format(dateFormat);
}

export function getTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
export function getStartDate(date) {
  console.log('sttime', date);
  return moment.utc(+date).format('YYYY-MM-DD HH:mm');
}
export function getEndDate(date) {
  console.log('endtime', date);
  return moment(+date).utc().add(1, 'day').subtract(1, 'second').format('YYYY-MM-DD HH:mm');
}

export function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
export const dummyCards = {
  User: {
    TOTAL_USERS: {
      key: 'Total Users',
      value: 23894,
      gradientFrom: 'from-info',
      gradientTo: 'to-pink-500'
    },
    TOTAL_REALCASH: {
      key: 'Total RealCash',
      value: 28495789,
      gradientFrom: 'from-amber-400',
      gradientTo: 'to-orange-600'
    },
    TOTAL_BONUS: {
      key: 'Total Bonus',
      value: 182538,
      gradientFrom: 'from-pink-500',
      gradientTo: 'to-rose-500'
    },
    INACTIVE_USERS: {
      key: 'Inactive Users',
      value: 4,
      gradientFrom: 'from-info',
      gradientTo: 'to-info-darker'
    }
  },
  Admin: {
    TOTAL_ADMIN: {
      key: 'Total Admin',
      value: 23,
      gradientFrom: 'from-amber-400',
      gradientTo: 'to-orange-600'
    },
    ACTIVE_ADMIN: {
      key: 'Active Admin',
      value: 22,
      gradientFrom: 'from-pink-500',
      gradientTo: 'to-rose-500'
    },
    INACTIVE_ADMIN: {
      key: 'Inactive Admin',
      value: 1,
      gradientFrom: 'from-info',
      gradientTo: 'to-info-darker'
    }
  },
  Affiliate: {
    TOTAL_AFFILIATE: {
      key: 'Total Affiliate',
      value: 157,
      gradientFrom: 'from-info',
      gradientTo: 'to-info-darker'
    },
    TOTAL_SIGNUP_USERS: {
      key: 'Total Signup Users',
      value: 9879,
      gradientFrom: 'from-amber-400',
      gradientTo: 'to-orange-600'
    },
    TOTAL_DEPOSITS: {
      key: 'Total Deposits',
      value: 294301,
      gradientFrom: 'from-pink-500',
      gradientTo: 'to-rose-500'
    },
    TOTAL_COMMISSION: {
      key: 'Total Commission',
      value: 65845,
      gradientFrom: 'from-info',
      gradientTo: 'to-pink-500'
    }
  },
  Country: {
    TOTAL_COUNTRY: {
      key: 'Total Country',
      value: 244,
      gradientFrom: 'from-amber-400',
      gradientTo: 'to-orange-600'
    },
    ACTIVE_COUNTRY: {
      key: 'Active Country',
      value: 239,
      gradientFrom: 'from-pink-500',
      gradientTo: 'to-rose-500'
    },
    INACTIVE_COUNTRY: {
      key: 'Inactive Country',
      value: 5,
      gradientFrom: 'from-info',
      gradientTo: 'to-info-darker'
    }
  },
  Category: {
    TOTAL_CATEGORIES: {
      key: 'Total Categories',
      value: 18,
      gradientFrom: 'from-amber-400',
      gradientTo: 'to-orange-600'
    },
    ACTIVE_CATEGORIES: {
      key: 'Active Categories',
      value: 17,
      gradientFrom: 'from-pink-500',
      gradientTo: 'to-rose-500'
    },
    INACTIVE_CATEGORIES: {
      key: 'Inactive Categories',
      value: 1,
      gradientFrom: 'from-info',
      gradientTo: 'to-pink-500'
    }
  },
  Provider: {
    TOTAL_PROVIDER: {
      key: 'Total Provider',
      value: 39,
      gradientFrom: 'from-amber-400',
      gradientTo: 'to-orange-600'
    },
    ACTIVE_PROVIDER: {
      key: 'Active Provider',
      value: 37,
      gradientFrom: 'from-pink-500',
      gradientTo: 'to-rose-500'
    },
    INACTIVE_PROVIDER: {
      key: 'Inactive Provider',
      value: 2,
      gradientFrom: 'from-info',
      gradientTo: 'to-info-darker'
    },
    TOTAL_GAMES: {
      key: 'Total Games',
      value: 238,
      gradientFrom: 'from-amber-400',
      gradientTo: 'to-orange-600'
    }
  },
  Games: {
    TOTAL_GAMES: {
      key: 'Total Games',
      value: 351,
      gradientFrom: 'from-pink-500',
      gradientTo: 'to-rose-500'
    },
    TOTAL_PROVIDER: {
      key: 'Total Provider',
      value: 39,
      gradientFrom: 'from-info',
      gradientTo: 'to-info-darker'
    }
  },
  PromoCode: {
    TOTAL_PROMOCODE: {
      key: 'Total Promocode',
      value: 14,
      gradientFrom: 'from-amber-400',
      gradientTo: 'to-orange-600'
    },
    TOTAL_DEPOSITS: {
      key: 'Total Deposits',
      value: 11253,
      gradientFrom: 'from-pink-500',
      gradientTo: 'to-rose-500'
    },
    TOTAL_REWARDS: {
      key: 'Total Rewards',
      value: 5743,
      gradientFrom: 'from-info',
      gradientTo: 'to-pink-500'
    },
    TOTAL_WAGERING: {
      key: 'Total Wagering',
      value: 38521,
      gradientFrom: 'from-amber-400',
      gradientTo: 'to-orange-600'
    }
  }
};

export function getDummyCardData(type) {
  return dummyCards[type] || {};
}
