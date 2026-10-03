export interface HolidayItem {
  id: string;
  date: string; // DD.MM.YYYY
  name: string;
  dayOfWeek: string;
  month: string;
  category: 'National' | 'Festival' | 'State' | 'Jayanthi';
  description: string;
  sweetServed: string;
}

export interface MealItem {
  name: string;
  type: 'staple' | 'curry' | 'snack' | 'beverage' | 'sweet';
  icon: string;
  description: string;
}

export interface DayMessMenu {
  day: string;
  dayName: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  specialHighlight: string;
  meals: {
    breakfast: {
      timing: string;
      items: string[];
      beverage: string;
      icons: string[];
    };
    lunch: {
      timing: string;
      items: string[];
      dessert?: string;
      icons: string[];
    };
    snacks: {
      timing: string;
      items: string[];
      beverage: string;
      icons: string[];
    };
    dinner: {
      timing: string;
      items: string[];
      dessert: string;
      icons: string[];
    };
  };
}

export interface FacilityItem {
  id: string;
  name: string;
  icon: string;
  location: string;
  hours: string;
  status: 'Open' | 'Restricted' | 'Available';
  description: string;
  blockType: 'quartz' | 'wood' | 'prismarine' | 'gold';
  actionLabel: string;
  details: { label: string; value: string }[];
}

export interface FeeBreakdownItem {
  category: string;
  amount: number;
  emeraldCount: number;
  icon: string;
  description: string;
  percentage: number;
}

export interface StudentRecord {
  id: string;
  name: string;
  usn: string;
  room: string;
  wing: 'A' | 'B' | 'C';
  floor: number;
  branch: string;
  attendancePercent: number;
  presentToday: boolean;
  parentName: string;
  parentPhone: string;
  lastCheckinTime: string;
}

export interface HostelNotice {
  id: string;
  title: string;
  category: 'General' | 'Mess' | 'Curfew' | 'Holiday' | 'Maintenance';
  content: string;
  date: string;
  author: string;
  urgent: boolean;
  target: 'All' | 'Students' | 'Parents';
}

export interface ComplaintTicket {
  id: string;
  studentName: string;
  room: string;
  category: 'Plumbing' | 'Electrical' | 'WiFi / Network' | 'Carpentry' | 'Cleanliness';
  description: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  timestamp: string;
  adminRemark?: string;
}

// ==========================================
// 1. ALL 24 OFFICIAL 2026 HOLIDAYS
// ==========================================
export const OFFICIAL_2026_HOLIDAYS: HolidayItem[] = [
  {
    id: 'h-1',
    date: '15.01.2026',
    name: 'Makara Sankranthi',
    dayOfWeek: 'Thursday',
    month: 'January',
    category: 'Festival',
    description: 'Harvest festival celebrated across Karnataka with Ellu-Bella and sugarcane distributions.',
    sweetServed: 'Sweet Pongal & Sugarcane'
  },
  {
    id: 'h-2',
    date: '26.01.2026',
    name: 'Republic Day',
    dayOfWeek: 'Monday',
    month: 'January',
    category: 'National',
    description: 'Celebration of the Constitution of India. Flag hoisting ceremony at MSRIT Main Ground at 8:30 AM.',
    sweetServed: 'Tiranga Jalebi & Laddoos'
  },
  {
    id: 'h-3',
    date: '02.03.2026',
    name: 'Holi Fest',
    dayOfWeek: 'Monday',
    month: 'March',
    category: 'Festival',
    description: 'Festival of colors. Special dry gulal celebrations permitted in open hostel quadrangle until 1:00 PM.',
    sweetServed: 'Gujiya & Kesar Thandai'
  },
  {
    id: 'h-4',
    date: '19.03.2026',
    name: 'Ugadi',
    dayOfWeek: 'Thursday',
    month: 'March',
    category: 'Festival',
    description: 'Kannada New Year celebration marking the beginning of Chaitra masa. Traditional feast in mess.',
    sweetServed: 'Obbattu (Holige) & Mango Shrikhand'
  },
  {
    id: 'h-5',
    date: '21.03.2026',
    name: 'Ramzan',
    dayOfWeek: 'Saturday',
    month: 'March',
    category: 'Festival',
    description: 'Eid-ul-Fitr celebrations. Special early morning Sehri arrangements for observing students.',
    sweetServed: 'Sheer Khurma & Shahi Tukda'
  },
  {
    id: 'h-6',
    date: '31.03.2026',
    name: 'Mahavir Jayanthi',
    dayOfWeek: 'Tuesday',
    month: 'March',
    category: 'Jayanthi',
    description: 'Birth anniversary of Lord Mahavira emphasizing Ahimsa and truth. Pure sattvic meals served in mess.',
    sweetServed: 'Besan Ladoo'
  },
  {
    id: 'h-7',
    date: '03.04.2026',
    name: 'Good Friday',
    dayOfWeek: 'Friday',
    month: 'April',
    category: 'Festival',
    description: 'Christian holy day commemorating the crucifixion of Jesus Christ. Long weekend for outstation students.',
    sweetServed: 'Hot Cross Buns'
  },
  {
    id: 'h-8',
    date: '14.04.2026',
    name: 'Dr Ambedkar Jayanthi',
    dayOfWeek: 'Tuesday',
    month: 'April',
    category: 'Jayanthi',
    description: 'Commemoration of the architect of the Indian Constitution, Dr. B. R. Ambedkar.',
    sweetServed: 'Boondi Ladoo'
  },
  {
    id: 'h-9',
    date: '20.04.2026',
    name: 'Basava Jayanthi',
    dayOfWeek: 'Monday',
    month: 'April',
    category: 'Jayanthi',
    description: 'Celebration of Jagadjyothi Basaveshwara, 12th-century philosopher and social reformer of Karnataka.',
    sweetServed: 'Mysore Pak'
  },
  {
    id: 'h-10',
    date: '01.05.2026',
    name: 'May Day',
    dayOfWeek: 'Friday',
    month: 'May',
    category: 'National',
    description: 'International Workers\' Day. Hostel housekeeping and kitchen staff felicitation day.',
    sweetServed: 'Motichoor Ladoo'
  },
  {
    id: 'h-11',
    date: '28.05.2026',
    name: 'Bakrid',
    dayOfWeek: 'Thursday',
    month: 'May',
    category: 'Festival',
    description: 'Eid al-Adha. Feast of the sacrifice celebrated with traditional festive cuisine.',
    sweetServed: 'Seviyan Kheer'
  },
  {
    id: 'h-12',
    date: '26.06.2026',
    name: 'Moharam Last Day',
    dayOfWeek: 'Friday',
    month: 'June',
    category: 'Festival',
    description: 'Day of Ashura commemorating historical martyrdom and solemn prayer.',
    sweetServed: 'Sharbat & Sweet Halwa'
  },
  {
    id: 'h-13',
    date: '15.08.2026',
    name: 'Independence Day',
    dayOfWeek: 'Saturday',
    month: 'August',
    category: 'National',
    description: '79th Indian Independence Day. Flag hoisting, patriotic student performances, and special brunch.',
    sweetServed: 'Tiranga Burfi & Kaju Katli'
  },
  {
    id: 'h-14',
    date: '21.08.2026',
    name: 'Varamahalakshmi Vratha',
    dayOfWeek: 'Friday',
    month: 'August',
    category: 'Festival',
    description: 'Auspicious festival propitiating Goddess Lakshmi for prosperity and good fortune.',
    sweetServed: 'Coconut Holige & Payasa'
  },
  {
    id: 'h-15',
    date: '26.08.2026',
    name: 'Ed-Milad',
    dayOfWeek: 'Wednesday',
    month: 'August',
    category: 'Festival',
    description: 'Mawlid celebration observing the birth of the Prophet Muhammad.',
    sweetServed: 'Kheer Kadam'
  },
  {
    id: 'h-16',
    date: '14.09.2026',
    name: 'Ganesha Chaturthi',
    dayOfWeek: 'Monday',
    month: 'September',
    category: 'Festival',
    description: 'Grand eco-friendly clay Ganesha installation in Freshers Block courtyard. Maha Aarti & Prasada.',
    sweetServed: 'Steamed Modak & Panchakajjaya'
  },
  {
    id: 'h-17',
    date: '02.10.2026',
    name: 'Gandhi Jayanthi',
    dayOfWeek: 'Friday',
    month: 'October',
    category: 'National',
    description: 'Birth anniversary of Mahatma Gandhi. Swachh Freshers Block cleanliness drive & peace pledge.',
    sweetServed: 'Peda'
  },
  {
    id: 'h-18',
    date: '10.10.2026',
    name: 'Mahalaya Amavasye',
    dayOfWeek: 'Saturday',
    month: 'October',
    category: 'Festival',
    description: 'Culmination of Pitru Paksha and grand herald of the upcoming Navaratri celebrations.',
    sweetServed: 'Rice Kheer'
  },
  {
    id: 'h-19',
    date: '20.10.2026',
    name: 'Ayudha Pooja',
    dayOfWeek: 'Tuesday',
    month: 'October',
    category: 'Festival',
    description: 'Worship of instruments and tools of learning: laptops, engineering drafters, and mess equipment.',
    sweetServed: 'Pori Prasada & Sweet Avalakki'
  },
  {
    id: 'h-20',
    date: '21.10.2026',
    name: 'Vijayadashami',
    dayOfWeek: 'Wednesday',
    month: 'October',
    category: 'Festival',
    description: 'Dussehra victory of virtue over evil. Grand Karnataka Dasara festive feast in Freshers Block mess.',
    sweetServed: 'Mysore Pak & Badam Milk'
  },
  {
    id: 'h-21',
    date: '09.11.2026',
    name: 'Dipawali',
    dayOfWeek: 'Monday',
    month: 'November',
    category: 'Festival',
    description: 'Naraka Chaturdashi. Freshers Block lit with 500 earthen diyas and safe eco-crackers in ground.',
    sweetServed: 'Kaju Katli & Dry Fruit Ladoo'
  },
  {
    id: 'h-22',
    date: '10.11.2026',
    name: 'Dipawali (Balipadyami)',
    dayOfWeek: 'Tuesday',
    month: 'November',
    category: 'Festival',
    description: 'Balipadyami & Govardhan Pooja celebrations with traditional butter lanterns.',
    sweetServed: 'Gulab Jamun & Rasmalai'
  },
  {
    id: 'h-23',
    date: '27.11.2026',
    name: 'Kanakadasa Jayanth',
    dayOfWeek: 'Friday',
    month: 'November',
    category: 'Jayanthi',
    description: 'Tribute to saint-poet Kanakadasa, celebrated philosopher of Karnataka devotional literature.',
    sweetServed: 'Dharwad Peda'
  },
  {
    id: 'h-24',
    date: '25.12.2026',
    name: 'Christmas',
    dayOfWeek: 'Friday',
    month: 'December',
    category: 'Festival',
    description: 'Christmas celebration with illuminated pine tree in Freshers Block lobby and festive plum cake.',
    sweetServed: 'Rich Plum Cake & Choco Lava'
  }
];

// ==========================================
// 2. REAL 7-DAY MESS MENU (MSRIT FRESHERS BLOCK)
// ==========================================
export const MESS_TIMINGS = {
  breakfast: '7:30 AM – 9:30 AM',
  lunch: '12:00 PM – 2:15 PM',
  snacks: '4:30 PM – 5:30 PM',
  dinner: '7:30 PM – 9:30 PM'
};

export const MESS_CIRCULAR_NOTES = [
  'Items such as Roti / Phulka, Steamed Rice, Sambar, Curds, Papad, Pickle, and Green Salad are served daily along with meals.',
  'Availability of seasonal produce from the Agricultural Produce Market (APMC Yeshwanthpur) may affect some vegetable or snack preparations.',
  'Strictly 100% Vegetarian Dining Hall managed by the Student Mess Committee under Gokula Education Foundation Trust.',
  'Night Canteen facility is operational near Freshers Block from 9:30 PM to 11:30 PM for light refreshments and study snacks.'
];

export const WEEKLY_MESS_MENU: DayMessMenu[] = [
  {
    day: 'Monday',
    dayName: 'Monday',
    specialHighlight: 'Crispy Bengaluru Masala Dosa & Hot Filter Coffee',
    meals: {
      breakfast: {
        timing: MESS_TIMINGS.breakfast,
        items: ['Crispy Masala Dosa', 'Aloo Palya (Potato Filling)', 'Coconut Chutney', 'Hot Drumstick Sambar', 'Boiled Sprouts Salad'],
        beverage: 'Hot Filter Coffee / Masala Tea',
        icons: ['🥞', '🥔', '🥥', '🥣', '☕']
      },
      lunch: {
        timing: MESS_TIMINGS.lunch,
        items: ['Fresh Tawa Rotis (Hot & Soft)', 'Paneer Shimla Mirch Gravy', 'Yellow Dal Tadka', 'Steamed Sona Masoori Rice', 'Tomato Rasam', 'Set Curds', 'Appalam Papad', 'Cucumber & Carrot Salad', 'Mango Pickle'],
        dessert: 'Sweet Boondi',
        icons: ['🫓', '🧀', '🍲', '🍚', '🥗', '🥣']
      },
      snacks: {
        timing: MESS_TIMINGS.snacks,
        items: ['Crispy Vegetable Cutlets', 'Mint Pudina Chutney', 'Tomato Ketchup'],
        beverage: 'Hot Ginger Cardamom Tea / Coffee',
        icons: ['🧆', '🌿', '☕']
      },
      dinner: {
        timing: MESS_TIMINGS.dinner,
        items: ['Hot Phulkas (Unlimited)', 'Mixed Vegetable Kurma', 'Moong Dal Fry', 'Jeera Pulao Rice', 'Mysore Rasam', 'Curd', 'Fried Fryums'],
        dessert: 'Semiya Payasam (Kheer)',
        icons: ['🫓', '🥕', '🍲', '🍚', '🍮']
      }
    }
  },
  {
    day: 'Tuesday',
    dayName: 'Tuesday',
    specialHighlight: 'Fluffy Hot Pooris with Bangalore Aloo Saagu',
    meals: {
      breakfast: {
        timing: MESS_TIMINGS.breakfast,
        items: ['Golden Hot Pooris (4 pcs)', 'Bangalore Style Aloo Saagu', 'Fresh Coconut Chutney', 'Soaked Badam & Sprouts'],
        beverage: 'Hot Masala Tea / Coffee / Bournvita Milk',
        icons: ['🥖', '🥔', '🥥', '🥛', '☕']
      },
      lunch: {
        timing: MESS_TIMINGS.lunch,
        items: ['Fresh Chapati', 'Aloo Gobi Matar Masala', 'Palak Dal (Spinach Dal)', 'Lemon Chitranna Rice', 'Steamed White Rice', 'Karnataka Majjige Huli (Buttermilk Sambar)', 'Curds', 'Papad', 'Pickle'],
        dessert: 'Pineapple Kesari Bath',
        icons: ['🫓', '🥦', '🥣', '🍋', '🍚', '🍍']
      },
      snacks: {
        timing: MESS_TIMINGS.snacks,
        items: ['Crispy Aloo Samosa (Triangle Cut)', 'Tangy Imli (Tamarind) Chutney', 'Fried Green Chillies'],
        beverage: 'Hot Cutting Chai / Coffee',
        icons: ['🥟', '🌶️', '☕']
      },
      dinner: {
        timing: MESS_TIMINGS.dinner,
        items: ['Methi Phulka with Ghee', 'Punjabi Rajma Masala', 'Lauki Dal Fry', 'Kashmiri Peas Pulao', 'Steamed Rice', 'Pepper Rasam', 'Curds', 'Roasted Papad'],
        dessert: 'Fresh Seasonal Banana / Orange',
        icons: ['🫓', '🫘', '🍲', '🍚', '🍌']
      }
    }
  },
  {
    day: 'Wednesday',
    dayName: 'Wednesday',
    specialHighlight: 'Steamy Idli-Vada Feast & Royal Gulab Jamun',
    meals: {
      breakfast: {
        timing: MESS_TIMINGS.breakfast,
        items: ['Button Rice Idlis (3 pcs)', 'Crispy Medu Vada (1 pc)', 'Spicy Bangalore Drumstick Sambar', 'White Coconut Chutney', 'Tomato Chutney'],
        beverage: 'Hot Filter Coffee / Tea',
        icons: ['⚪', '🍩', '🥣', '🥥', '☕']
      },
      lunch: {
        timing: MESS_TIMINGS.lunch,
        items: ['Tandoori Styled Rotis', 'Kadai Paneer Masala (Special)', 'Panchmel Dal', 'Steamed Basmati Rice', 'Jeera Rasam', 'Fresh Curd', 'Bikaneri Papad', 'Onion Salad & Green Chilli'],
        dessert: 'Sweet Jalebi (Hot & Crispy)',
        icons: ['🫓', '🧀', '🍲', '🍚', '🥨']
      },
      snacks: {
        timing: MESS_TIMINGS.snacks,
        items: ['Butter Sweet Corn Chaat / Mirchi Bajji', 'Crisp Sev', 'Chaat Masala Sprinkle'],
        beverage: 'Hot Masala Tea / Coffee',
        icons: ['🌽', '🌶️', '☕']
      },
      dinner: {
        timing: MESS_TIMINGS.dinner,
        items: ['Hot Phulka', 'Veg Kolhapuri Spicy Gravy', 'Toor Dal Tadka', 'Hyderabadi Veg Biryani Rice', 'Cool Onion Tomato Raita', 'Steamed Rice', 'Tomato Rasam'],
        dessert: 'Hot Gulab Jamun (2 pcs in Sugar Syrup)',
        icons: ['🫓', '🍛', '🍲', '🍚', '🍯']
      }
    }
  },
  {
    day: 'Thursday',
    dayName: 'Thursday',
    specialHighlight: 'North-Indian Stuffed Aloo Paratha with White Butter',
    meals: {
      breakfast: {
        timing: MESS_TIMINGS.breakfast,
        items: ['Stuffed Aloo Paratha (2 pcs)', 'Amul Butter Cube', 'Indori Poha with Roasted Peanuts & Sev', 'Green Coriander Chutney', 'Mixed Mango Pickle'],
        beverage: 'Hot Masala Tea / Filter Coffee',
        icons: ['🫓', '🧈', '🥜', '🥣', '☕']
      },
      lunch: {
        timing: MESS_TIMINGS.lunch,
        items: ['Fresh Phulkas', 'Amritsari Chole (Chickpeas Gravy)', 'Yellow Dal Fry', 'Steamed Rice', 'Curd Rice with Pomegranate', 'South Indian Rasam', 'Crispy Papad', 'Spicy Green Salad'],
        dessert: 'Motichoor Ladoo',
        icons: ['🫓', '🫘', '🍲', '🍚', '🥣', '🟠']
      },
      snacks: {
        timing: MESS_TIMINGS.snacks,
        items: ['Mumbai Pav Bhaji (2 Butter-Toasted Pavs with Bhaji)', 'Chopped Onions & Fresh Lemon Slices'],
        beverage: 'Hot Filter Coffee / Masala Tea',
        icons: ['🍞', '🍛', '🍋', '☕']
      },
      dinner: {
        timing: MESS_TIMINGS.dinner,
        items: ['Hot Chapati', 'Bhindi Masala (Okra Stir-Fry)', 'Egg Curry (Optional for Eggitarians) / Paneer Curry', 'Moong Dal', 'Steamed Rice', 'Curds', 'Garlic Rasam', 'Papad'],
        dessert: 'Vanilla Fruit Custard with Apple & Grapes',
        icons: ['🫓', '🥗', '🥚', '🍲', '🍚', '🍮']
      }
    }
  },
  {
    day: 'Friday',
    dayName: 'Friday',
    specialHighlight: 'Onion Tomato Uttapam & Grand Veg Dum Biryani',
    meals: {
      breakfast: {
        timing: MESS_TIMINGS.breakfast,
        items: ['Onion & Tomato Uttapam (2 pcs)', 'Spicy Sambar', 'Allam (Ginger) Chutney', 'Coconut Chutney', 'Boiled Green Gram'],
        beverage: 'Hot Filter Coffee / Tea / Hot Badam Milk',
        icons: ['🥞', '🧅', '🥣', '🥥', '🥛']
      },
      lunch: {
        timing: MESS_TIMINGS.lunch,
        items: ['Soft Tawa Roti', 'Paneer Butter Masala', 'Chana Dal Palak', 'Steamed White Rice', 'Mysore Rasam', 'Thick Curd', 'Urad Papad', 'Kachumber Salad', 'Lemon Pickle'],
        dessert: 'Mysore Pak (Ghee Rich)',
        icons: ['🫓', '🧀', '🍲', '🍚', '🥣', '🧈']
      },
      snacks: {
        timing: MESS_TIMINGS.snacks,
        items: ['Bangalore Aloo Bonda (2 pcs)', 'Crispy Kara Boondi', 'Coconut Green Chutney'],
        beverage: 'Hot Masala Chai / Filter Coffee',
        icons: ['🧆', '🥥', '☕']
      },
      dinner: {
        timing: MESS_TIMINGS.dinner,
        items: ['Malabar Parotta / Roti', 'Vegetable Korma Gravy', 'Royal Dum Biryani (Basmati Rice with Soya & Veggies)', 'Thick Cucumber Onion Raita', 'Steamed Plain Rice', 'Tomato Rasam'],
        dessert: 'Amul Vanilla & Chocolate Cup Ice Cream',
        icons: ['🫓', '🍲', '🍚', '🥗', '🍨']
      }
    }
  },
  {
    day: 'Saturday',
    dayName: 'Saturday',
    specialHighlight: 'Karnataka Chow Chow Bath (Khara Bath + Kesari Bath)',
    meals: {
      breakfast: {
        timing: MESS_TIMINGS.breakfast,
        items: ['Karnataka Khara Bath (Rava Upma with Veggies)', 'Sweet Pineapple Kesari Bath', 'Crisp Coconut Chutney', 'Banana', 'Spiced Buttermilk'],
        beverage: 'Hot Filter Coffee / Masala Tea',
        icons: ['🥣', '🍍', '🥥', '🍌', '☕']
      },
      lunch: {
        timing: MESS_TIMINGS.lunch,
        items: ['Hot Phulka', 'Dum Aloo Kashmiri', 'Yellow Moong Dal Tadka', 'Authentic Karnataka Bisi Bele Bath with Boondi', 'Steamed Plain Rice', 'Curd', 'Appalam Papad', 'Pickle'],
        dessert: 'Moong Dal Halwa (Ghee)',
        icons: ['🫓', '🥔', '🍲', '🍚', '🥣', '🍮']
      },
      snacks: {
        timing: MESS_TIMINGS.snacks,
        items: ['Bread Pakoda with Stuffed Potato', 'Tomato Ketchup & Mint Dip'],
        beverage: 'Hot Masala Chai / Coffee',
        icons: ['🥪', '🍅', '☕']
      },
      dinner: {
        timing: MESS_TIMINGS.dinner,
        items: ['Chapati', 'Paneer Tikka Masala', 'Masoor Dal Fry', 'Corn & Capsicum Pulao', 'Steamed Rice', 'Garlic Pepper Rasam', 'Set Curds', 'Papad'],
        dessert: 'Hot Sweet Kheer with Dry Fruits',
        icons: ['🫓', '🧀', '🍲', '🍚', '🥣', '🍮']
      }
    }
  },
  {
    day: 'Sunday',
    dayName: 'Sunday',
    specialHighlight: 'Grand Sunday Feast: Bhature Chole & Shahi Paneer Feast',
    meals: {
      breakfast: {
        timing: MESS_TIMINGS.breakfast,
        items: ['Giant Puffy Chole Bhature (2 pcs)', 'Spicy Amritsari Chana Gravy', 'Pickled Green Chillies & Onions', 'Sweet Thick Lassi (Chilled)'],
        beverage: 'Hot Tea / Filter Coffee',
        icons: ['🥖', '🫘', '🧅', '🥛', '☕']
      },
      lunch: {
        timing: MESS_TIMINGS.lunch,
        items: ['Butter Naan & Kulcha', 'Shahi Paneer (Cashew Gravy)', 'Dal Makhani (Slow Cooked Overnight)', 'Kashmiri Veg Pulao', 'Steamed White Rice', 'Drumstick Rasam', 'Boondi Raita', 'Roasted Masala Papad'],
        dessert: 'Kolkata Sweet Rasgulla (2 pcs)',
        icons: ['🫓', '🧀', '🍲', '🍚', '🥗', '⚪']
      },
      snacks: {
        timing: MESS_TIMINGS.snacks,
        items: ['Osmania Butter Biscuits', 'Fresh Papaya & Watermelon Fruit Bowl'],
        beverage: 'Hot Ginger Cardamom Tea / Coffee',
        icons: ['🍪', '🍉', '☕']
      },
      dinner: {
        timing: MESS_TIMINGS.dinner,
        items: ['Hot Phulka', 'Aloo Matar Makhani', 'Mixed Dal Tadka', 'Indo-Chinese Veg Fried Rice', 'Veg Manchurian Gravy', 'Steamed Rice', 'Curds', 'Papad'],
        dessert: 'Fresh Strawberry / Mango Ice Cream Cup',
        icons: ['🫓', '🍛', '🍲', '🍚', '🍨']
      }
    }
  }
];

// ==========================================
// 3. HOSTEL FACILITIES (FRESHERS BLOCK MSRIT)
// ==========================================
export const HOSTEL_FACILITIES: FacilityItem[] = [
  {
    id: 'washroom',
    name: 'Common Washroom & Solar Geyser',
    icon: '🚿',
    location: 'Each Wing (Floors 1, 2, 3, 4)',
    hours: 'Hot Water: 6:00 AM – 11:00 AM Daily',
    status: 'Open',
    description: 'Equipped with solar and electrical backup geysers, hygienic private cubicles, mirror vanity, and automated exhaust system.',
    blockType: 'quartz',
    actionLabel: 'Check Water Temp & Status',
    details: [
      { label: 'Hot Water Supply', value: '6:00 AM to 11:00 AM' },
      { label: 'Geyser Type', value: 'Solar Thermal + 200kW Electric Grid' },
      { label: 'Cleaning Schedule', value: 'Twice Daily (11:30 AM & 4:00 PM)' },
      { label: 'Current Water Temp', value: '42°C (Optimal Steam)' }
    ]
  },
  {
    id: 'basketball',
    name: 'Floodlit Basketball Court',
    icon: '🏀',
    location: 'West Quadrangle (Behind Freshers Block)',
    hours: '6:00 AM – 9:30 PM Daily',
    status: 'Available',
    description: 'FIBA standard acrylic synthetic surface with LED high-beam floodlights and shock-absorbing spring hoops for 3v3 and full-court games.',
    blockType: 'gold',
    actionLabel: 'Book Evening Game Slot',
    details: [
      { label: 'Surface Type', value: 'Olympic Synthetic Acrylic 8-Layer' },
      { label: 'Floodlights On', value: '6:30 PM to 9:30 PM' },
      { label: 'Current Court Load', value: '6 Players Active (Slots Open)' },
      { label: 'Equipment Issue', value: 'Sports Room Counter (ID Card Required)' }
    ]
  },
  {
    id: 'tennis',
    name: 'Lawn Tennis & Badminton Court',
    icon: '🎾',
    location: 'Sports Complex (Adjacent to Freshers Gym)',
    hours: '6:00 AM – 9:00 AM & 4:30 PM – 9:00 PM',
    status: 'Available',
    description: 'Twin fenced courts with synthetic court grass, regulation netting, referee chair, and evening lighting for competitive rallies.',
    blockType: 'wood',
    actionLabel: 'Issue Rackets & Balls',
    details: [
      { label: 'Courts Available', value: '2 Synthetic Tennis Courts' },
      { label: 'Morning Slot', value: '6:00 AM – 9:00 AM' },
      { label: 'Evening Slot', value: '4:30 PM – 9:00 PM' },
      { label: 'Racket Issue Limit', value: '2 Rackets per Room for 90 Mins' }
    ]
  },
  {
    id: 'housekeeping',
    name: 'Housekeeping Service & Sanity NPC',
    icon: '🧹',
    location: 'Ground Floor Caretaker Office (Ext 204)',
    hours: '8:30 AM – 5:00 PM (Monday to Saturday)',
    status: 'Open',
    description: 'Dedicated custodial staff providing daily corridor sweeping, room floor mopping, wet waste / dry waste disposal, and pest prevention.',
    blockType: 'prismarine',
    actionLabel: 'Request Room Deep Cleaning',
    details: [
      { label: 'Room Mopping', value: 'Every Tuesday & Friday' },
      { label: 'Dustbin Clearance', value: 'Every Morning 9:00 AM' },
      { label: 'Pest Control Cycle', value: 'Fortnightly (Next: 15 Oct)' },
      { label: 'Caretaker Contact', value: 'Mr. Shivanna (Ext 204)' }
    ]
  },
  {
    id: 'laundry',
    name: 'Hostel Smart Laundry & Steam Ironing',
    icon: '🧺',
    location: 'Utility Block Basement (Turnstile B)',
    hours: '7:00 AM – 8:00 PM (Drop-off & Pickup)',
    status: 'Open',
    description: 'High-capacity industrial washing machines, tumble dryers, and quick steam-press ironing. 4 complimentary laundry tokens per month per student.',
    blockType: 'quartz',
    actionLabel: 'Drop Clothes with Token',
    details: [
      { label: 'Monthly Allowance', value: '4 Washing Cycles (Up to 7kg each)' },
      { label: 'Turnaround Time', value: '24 Hours (Express: 6 Hours)' },
      { label: 'Active Tokens Left', value: '3 / 4 Tokens Available' },
      { label: 'Steam Press Facility', value: '₹5 per Shirt / Trouser' }
    ]
  }
];

// ==========================================
// 4. HOSTEL FEES BREAKDOWN (EXACT ₹1,07,000)
// ==========================================
export const HOSTEL_FEE_BREAKDOWN: FeeBreakdownItem[] = [
  {
    category: 'MESS CHARGES',
    amount: 35000,
    emeraldCount: 35,
    icon: '🍲',
    description: 'Covers all 4 daily meals (Breakfast, Lunch, Evening Snacks, Special Dinner) for both academic semesters (10 full months).',
    percentage: 32.7
  },
  {
    category: 'AMENITY CHARGES',
    amount: 44000,
    emeraldCount: 44,
    icon: '⚡',
    description: 'High-speed campus fiber WiFi (100 Mbps per student), 24/7 electricity with heavy generator backup, solar water heating, and water purifiers.',
    percentage: 41.1
  },
  {
    category: 'MAINTENANCE CHARGES',
    amount: 22000,
    emeraldCount: 22,
    icon: '🛠️',
    description: 'Daily housekeeping, custodial hygiene, lift maintenance, common area repairs, pest control, sports court resurfacing, and garden upkeep.',
    percentage: 20.6
  },
  {
    category: 'ADMISSION FEES',
    amount: 1000,
    emeraldCount: 1,
    icon: '📜',
    description: 'One-time hostel orientation registration, biometric turnstile ID card issuance, and Freshers Welcome Kit.',
    percentage: 0.9
  },
  {
    category: 'SECURITY DEPOSIT',
    amount: 5000,
    emeraldCount: 5,
    icon: '💎',
    description: 'Refundable caution deposit returned at the end of the academic year upon clearance certificate from room caretaker.',
    percentage: 4.7
  }
];

export const TOTAL_HOSTEL_FEE = 107000;

// ==========================================
// 5. HOSTEL RULES & DAY/NIGHT CURFEW
// ==========================================
export const HOSTEL_RULES = [
  {
    title: 'HOSTEL IN-TIME & CURFEW',
    time: '10:00 PM STRICTLY',
    icon: '🌙',
    badge: 'MANDATORY',
    description: 'All students must be inside Freshers Block before 10:00 PM. The main biometric turnstile gates automatically lock. Late entry requires written permission from Chief Warden and parent SMS verification.'
  },
  {
    title: 'MORNING GATES OPEN',
    time: '6:00 AM',
    icon: '☀️',
    badge: 'ACTIVE',
    description: 'Hostel gates unlock at 6:00 AM. Students are permitted to exit for morning sports, temple visits, jogging at MSRIT ground, or early gym sessions.'
  },
  {
    title: 'CONTRABAND APPLIANCES POLICY',
    time: '24/7 SURVEILLANCE',
    icon: '⚡',
    badge: 'STRICT',
    description: 'High-wattage heating coils, immersion rods, and electric induction plates are strictly prohibited due to fire safety regulations. Laptops, mobile chargers, study lamps, and mosquito vaporizers are allowed.'
  },
  {
    title: 'VISITOR & GUEST REGULATIONS',
    time: '4:30 PM – 7:30 PM',
    icon: '👥',
    badge: 'VISITORS',
    description: 'Parents and authorized guardians may meet students in the Freshers Block Reception & Visitor Lounge. No outside visitors or non-residents are allowed inside student rooms.'
  },
  {
    title: 'QUIET STUDY HOURS',
    time: '11:00 PM – 6:00 AM',
    icon: '🤫',
    badge: 'EXAMS',
    description: 'Corridor quiet hours. Loud speakers, guitar playing in corridors, and noisy gatherings are prohibited to respect peer study and sleep cycles.'
  }
];

// ==========================================
// 6. DEFAULT HOSTEL ANNOUNCEMENTS
// ==========================================
export const DEFAULT_NOTICES: HostelNotice[] = [
  {
    id: 'n-1',
    title: 'Welcome to Freshers Block (2026 Batch)!',
    category: 'General',
    content: 'Welcome to your new home at MSRIT Freshers Block! Biometric registration is underway at the Ground Floor office. Please collect your room keys and inventory checklist from Mr. Shivanna.',
    date: '01 Oct 2026',
    author: 'Chief Warden Office',
    urgent: true,
    target: 'All'
  },
  {
    id: 'n-2',
    title: 'Special Ugadi Festive Lunch on 19.03.2026',
    category: 'Mess',
    content: 'The Student Mess Committee has arranged a grand traditional Karnataka Ugadi festive meal featuring authentic Obbattu (Holige), Mango Shrikhand, and special Payasam. Mess opens early at 11:45 AM.',
    date: '02 Oct 2026',
    author: 'Mess Committee Secretary',
    urgent: false,
    target: 'Students'
  },
  {
    id: 'n-3',
    title: 'Fiber Internet Bandwidth Upgrade to 100 Mbps',
    category: 'General',
    content: 'All WiFi access points across Wings A, B, and C have been connected to 1 Gbps backbone leased lines. Use your college USN and student portal password for seamless authentication.',
    date: '28 Sep 2026',
    author: 'Campus IT Network Cell',
    urgent: false,
    target: 'Students'
  },
  {
    id: 'n-4',
    title: 'Weekend Outpass Digital Approval Portal Active',
    category: 'Curfew',
    content: 'Parents can now submit weekend home leaves directly via the Parent Portal. Digital gate passes will be generated automatically upon parent OTP confirmation.',
    date: '25 Sep 2026',
    author: 'Freshers Block Warden',
    urgent: false,
    target: 'Parents'
  },
  {
    id: 'n-5',
    title: 'Hot Water Geyser Scheduled Inspection',
    category: 'Maintenance',
    content: 'Solar thermal pipeline maintenance on 4th floor completed. Hot water supply is guaranteed every morning from 6:00 AM to 11:00 AM across all wings.',
    date: '20 Sep 2026',
    author: 'Estate Maintenance Division',
    urgent: false,
    target: 'All'
  }
];

// ==========================================
// 7. DEFAULT STUDENT ROSTER (DEMO DATA)
// ==========================================
export const DEFAULT_STUDENTS: StudentRecord[] = [
  {
    id: 'std-1',
    name: 'Aarav Sharma',
    usn: '1MS26CS042',
    room: '204',
    wing: 'B',
    floor: 2,
    branch: 'Computer Science & Engineering',
    attendancePercent: 92,
    presentToday: true,
    parentName: 'Mr. Rajesh Sharma',
    parentPhone: '+91 98451 22334',
    lastCheckinTime: 'Today, 8:42 AM'
  },
  {
    id: 'std-2',
    name: 'Rohan Nambiar',
    usn: '1MS26CS089',
    room: '204',
    wing: 'B',
    floor: 2,
    branch: 'Computer Science & Engineering',
    attendancePercent: 88,
    presentToday: true,
    parentName: 'Mrs. Geeta Nambiar',
    parentPhone: '+91 98452 33445',
    lastCheckinTime: 'Today, 8:45 AM'
  },
  {
    id: 'std-3',
    name: 'Aditya Kulkarni',
    usn: '1MS26IS015',
    room: '108',
    wing: 'A',
    floor: 1,
    branch: 'Information Science & Engineering',
    attendancePercent: 95,
    presentToday: true,
    parentName: 'Mr. Anand Kulkarni',
    parentPhone: '+91 98453 44556',
    lastCheckinTime: 'Today, 8:30 AM'
  },
  {
    id: 'std-4',
    name: 'Vignesh Iyer',
    usn: '1MS26EC077',
    room: '312',
    wing: 'C',
    floor: 3,
    branch: 'Electronics & Communication',
    attendancePercent: 84,
    presentToday: true,
    parentName: 'Mr. S. Iyer',
    parentPhone: '+91 98454 55667',
    lastCheckinTime: 'Today, 8:50 AM'
  },
  {
    id: 'std-5',
    name: 'Pranav Rao',
    usn: '1MS26AI031',
    room: '215',
    wing: 'B',
    floor: 2,
    branch: 'Artificial Intelligence & Data Science',
    attendancePercent: 78,
    presentToday: false,
    parentName: 'Dr. Sudheer Rao',
    parentPhone: '+91 98455 66778',
    lastCheckinTime: 'Yesterday, 9:15 PM'
  },
  {
    id: 'std-6',
    name: 'Tanmay Hegde',
    usn: '1MS26ME022',
    room: '402',
    wing: 'A',
    floor: 4,
    branch: 'Mechanical Engineering',
    attendancePercent: 91,
    presentToday: true,
    parentName: 'Mr. Ganapathi Hegde',
    parentPhone: '+91 98456 77889',
    lastCheckinTime: 'Today, 8:38 AM'
  },
  {
    id: 'std-7',
    name: 'Nikhil Gowda',
    usn: '1MS26CV019',
    room: '105',
    wing: 'A',
    floor: 1,
    branch: 'Civil Engineering',
    attendancePercent: 72,
    presentToday: false,
    parentName: 'Mr. Chandregowda',
    parentPhone: '+91 98457 88990',
    lastCheckinTime: 'Yesterday, 8:00 PM (Outpass)'
  },
  {
    id: 'std-8',
    name: 'Kabir Patel',
    usn: '1MS26CS112',
    room: '304',
    wing: 'C',
    floor: 3,
    branch: 'Computer Science & Engineering',
    attendancePercent: 96,
    presentToday: true,
    parentName: 'Mr. Nitin Patel',
    parentPhone: '+91 98458 99001',
    lastCheckinTime: 'Today, 8:25 AM'
  }
];

// ==========================================
// 8. EMERGENCY CONTACTS (FOR PARENTS & STUDENTS)
// ==========================================
export const EMERGENCY_CONTACTS = [
  {
    role: 'Chief Warden (Hostels)',
    name: 'Dr. K. S. Sharma',
    phone: '+91 98450 12345',
    email: 'chiefwarden@msrit.edu',
    location: 'Central Administrative Block, Room 102'
  },
  {
    role: 'Freshers Block Warden',
    name: 'Prof. Ramesh N (CSE Dept)',
    phone: '+91 98450 67890',
    email: 'warden.freshers@msrit.edu',
    location: 'Freshers Block Ground Floor Office'
  },
  {
    role: 'Hostel Resident Medical Officer',
    name: 'Dr. Shweta Murthy (Ramaiah Hospital)',
    phone: '+91 80 2360 8888',
    email: 'healthcenter@msrit.edu',
    location: 'Campus Health Clinic (Mon-Sat 5:00-7:00 PM)'
  },
  {
    role: '24/7 Security Control Desk',
    name: 'Chief Security Officer (Main Gate)',
    phone: '+91 80 2360 0822 (Ext 401)',
    email: 'security@msrit.edu',
    location: 'Gate No. 1, MSR Nagar Main Road'
  },
  {
    role: 'Ramaiah Memorial Hospital Emergency',
    name: 'Trauma & Emergency Care',
    phone: '080-2360 9999 / 108',
    email: 'emergency@msrmh.com',
    location: 'New BEL Road, Mathikere, Bangalore'
  }
];
