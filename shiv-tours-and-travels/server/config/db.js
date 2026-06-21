import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';
import Package from '../models/Package.js';
import Review from '../models/Review.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Run Database Seeding
    await seedDatabase();
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    // 1. Seed Admin User
    const adminUser = await User.findOne({ username: 'shivtours' });
    if (!adminUser) {
      const hashedPassword = bcrypt.hashSync('shiv12', 10);
      await User.create({
        username: 'shivtours',
        password: hashedPassword
      });
      console.log('Admin Account Seeded (shivtours / shiv12)');
      // Clean up any old admin accounts
      await User.deleteMany({ username: { $ne: 'shivtours' } });
    }


    // 2. Seed Vehicles Fleet
    const vehicleCount = await Vehicle.countDocuments();
    if (vehicleCount === 0) {
      const defaultVehicles = [
        {
          name: 'Sedan (Dzire / Aura / Xcent)',
          type: 'Sedan (4+1)',
          seats: 4,
          ac: 'AC Car Only',
          rate: 13,
          luggage: '2 Large Bags',
          features: ['GPS Navigation', 'Music System', 'USB Charging Port', 'Verified Driver'],
          bestFor: 'Perfect for small families, solo travelers, and short outstation trips.',
          img: '/dzire.png'
        },
        {
          name: 'Maruti Ertiga / Toyota Rumion',
          type: 'SUV (6+1)',
          seats: 6,
          ac: 'AC Car Only',
          rate: 16,
          luggage: '3-4 Bags',
          features: ['Roof Carrier Available', 'Spacious Cabin', 'Music System', 'USB Charging Port'],
          bestFor: 'Best for medium families, group trips, and pilgrimage tours.',
          img: '/ertiga.png'
        },
        {
          name: 'Kia Carens',
          type: 'Premium SUV (6+1)',
          seats: 6,
          ac: 'AC Car Only',
          rate: 17,
          luggage: '3 Bags',
          features: ['Captain Seats', 'Premium Interior', 'USB Charging in all rows', 'Polite Driver'],
          bestFor: 'Modern comfort and premium look for family vacations.',
          img: '/carens.png'
        },
        {
          name: 'Toyota Innova',
          type: 'Comfort MUV (7+1)',
          seats: 7,
          ac: 'AC Car Only',
          rate: 19,
          luggage: '4 Bags',
          features: ['Extremely Reliable', 'Spacious Seats', 'Dual AC', 'Polite Local Driver'],
          bestFor: 'Highly comfortable and reliable family outstation travel.',
          img: '/innova.png'
        },
        {
          name: 'Toyota Innova Crysta',
          type: 'Luxury MUV (7+1)',
          seats: 7,
          ac: 'AC Car Only',
          rate: 22,
          luggage: '4 Large Bags',
          features: ['Premium Captain Seats', 'Automatic Climate Control', 'Premium Sound System', 'Roof Carrier Available'],
          bestFor: 'The ultimate luxury travel for long outstation trips and business meetings.',
          img: '/innovacrysta.png'
        },
        {
          name: 'Tata Winger (12 Seater)',
          type: 'Tempo (12+1)',
          seats: 12,
          ac: 'AC & Non-AC Available',
          rate: 22,
          rateAc: 25,
          luggage: '6+ Bags + Roof Carrier',
          features: ['Spacious Standup Cabin', 'Individual AC Vents', 'Music System', 'Perfect for Group Tours'],
          bestFor: 'Perfect for group trips, family picnics, and wedding parties.',
          img: '/winger.jpg'
        },
        {
          name: 'Tempo Traveller (14 Seater)',
          type: 'Luxury Van (14+1)',
          seats: 14,
          ac: 'AC & Non-AC Available',
          rate: 25,
          rateAc: 30,
          luggage: '8+ Bags + Roof Carrier',
          features: ['Pushback Seats', 'Music System & Screen', 'Excellent Legroom', 'Comfortable Suspension'],
          bestFor: 'Best for pilgrim groups, medium tourist groups, and marriages.',
          img: '/tempotraveller.png'
        },
        {
          name: 'Tempo Traveller (17 Seater)',
          type: 'Luxury Van (17+1)',
          seats: 17,
          ac: 'AC & Non-AC Available',
          rate: 30,
          rateAc: 35,
          luggage: '10+ Bags + Roof Carrier',
          features: ['Pushback Seats', 'Music System', 'LED Screen', 'Luggage Carrier'],
          bestFor: 'Large families, pilgrim groups, and outstation tours.',
          img: '/tempotraveller.png'
        },
        {
          name: 'Tempo Traveller (20 Seater)',
          type: 'Luxury Van (20+1)',
          seats: 20,
          ac: 'AC & Non-AC Available',
          rate: 35,
          rateAc: 40,
          luggage: '12+ Bags + Roof Carrier',
          features: ['Comfortable Pushback Seats', 'Spacious Aisle', 'Screen & Mic System', 'Roof Carrier'],
          bestFor: 'Large groups, wedding guests, and corporate events.',
          img: '/tempotraveller.png'
        },
        {
          name: 'Tempo Traveller (26 Seater)',
          type: 'Luxury Bus (26+1)',
          seats: 26,
          ac: 'AC & Non-AC Available',
          rate: 40,
          rateAc: 45,
          luggage: '15+ Bags + Roof Carrier',
          features: ['Wide Body Design', 'Premium Pushback Seats', 'LED TV Screen', 'Ample Trunk Space'],
          bestFor: 'Very large groups, tour operators, and wedding transport.',
          img: '/tempotraveller.png'
        },
        {
          name: 'Force Urbania (Premium)',
          type: 'VIP Luxury MUV',
          seats: 17,
          ac: 'AC Car Only',
          rate: 45,
          luggage: 'Huge Luggage space',
          features: ['Ultra Premium Recliner Seats', 'Individual AC Vents & USB Ports', 'Panoramic Windows', 'Super Quiet Ride'],
          bestFor: 'Premium VIP group travel, luxury outstation trips, and corporate delegates.',
          img: '/urbania.jpg'
        }
      ];
      await Vehicle.create(defaultVehicles);
      console.log('Vehicles Fleet Seeding Completed');
    }

    // 3. Seed Tour Packages
    const packageCount = await Package.countDocuments();
    if (packageCount === 0) {
      const defaultPackages = [
        {
          title: 'Shirdi Sai Baba Spiritual Tour',
          type: 'spiritual',
          duration: '1 Day Trip',
          price: 'Starting from ₹2,999',
          description: 'Spiritual journey from Nashik/Mumbai to Shirdi Sai Baba Temple & Shani Shingnapur.',
          img: '/shirdi.png',
          itinerary: [
            '06:00 AM - Driver picks you up from your location in Nashik.',
            '08:00 AM - Reach Shirdi Sai Temple, join darshan queue.',
            '12:30 PM - Traditional vegetarian lunch at Shirdi.',
            '02:00 PM - Drive to Shani Shingnapur Temple.',
            '04:30 PM - Start return journey back to Nashik.',
            '07:30 PM - Drop back safely at your residence.'
          ],
          includes: ['AC Sedan vehicle', 'Experienced Driver', 'Fuel & State Taxes', 'Home Pickup & Drop'],
          excludes: ['Darshan VIP Pass costs', 'Food & Hotel meals', 'Parking charges at temple']
        },
        {
          title: 'Nashik Vineyards & Temples',
          type: 'weekend',
          duration: 'Weekend Special (2 Days)',
          price: 'Starting from ₹5,499',
          description: 'Perfect mix of historical temples and modern Sula Vineyards sightseeing.',
          img: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80',
          itinerary: [
            'Day 1 - Morning visit to Trimbakeshwar Shiva Jyotirlinga Temple, Panchavati, and Kalaram Temple.',
            'Day 1 - Evening walk along the Godavari River Ram Kund.',
            'Day 2 - Morning check-out for Sula Vineyards wine tasting & vineyard tour.',
            'Day 2 - Afternoon visit to Someshwar Waterfalls and Pandavleni Buddhist Caves.',
            'Day 2 - Evening drop off at Nashik Railway Station or Hotel.'
          ],
          includes: ['AC Hatchback/Sedan', 'Local Guide assistance', 'Fuel & toll taxes', 'Hotel transfers'],
          excludes: ['Sula Entry & Wine tasting ticket fees', 'Hotel accommodation stay', 'Personal shopping expenses']
        },
        {
          title: 'Mahabaleshwar & Panchgani Escape',
          type: 'family',
          duration: '3 Days / 2 Nights',
          price: 'Starting from ₹12,999',
          description: 'Scenic hill station journey with viewpoints, strawberry farms, and lake boating.',
          img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
          itinerary: [
            'Day 1 - Morning drive from Nashik/Mumbai to Mahabaleshwar. Check-in to hotel.',
            'Day 1 - Sunset view at Bombay Point and local market shopping.',
            'Day 2 - Visit Venna Lake for boating, Mapro Garden, and Panchgani table-land.',
            'Day 3 - Morning visit to Pratapgad Fort & historical heritage walk.',
            'Day 3 - Afternoon return drive back to Nashik/Mumbai.'
          ],
          includes: ['AC SUV (Ertiga/Innova)', 'Intercity state border permits', 'Driver hotel stay/food allowance', 'Luggage space'],
          excludes: ['Hotel booking accommodation', 'Venna Lake boating tickets', 'Pratapgad local guide charges']
        },
        {
          title: 'Ashtavinayak Ganesha Pilgrimage',
          type: 'spiritual',
          duration: '3 Days Trip',
          price: 'Starting from ₹15,999',
          description: 'Holy tour to visit all 8 self-manifested (Swayambhu) Ganesha temples in Maharashtra.',
          img: 'https://images.unsplash.com/photo-1626014303757-6fcbe6a53596?auto=format&fit=crop&w=600&q=80',
          itinerary: [
            'Day 1 - Moreshwar (Morgaon), Siddhivinayak (Siddhatek), and Chintamani (Theur).',
            'Day 2 - Girijatmak (Lenyadri Hill Cave), Vighneshwar (Ozar), and Mahaganapati (Ranjangaon).',
            'Day 3 - Varadvinayak (Mahad) and Ballaleshwar (Pali). Return to starting location.'
          ],
          includes: ['AC SUV Crysta/Ertiga', 'Experienced route driver', 'State boundary toll permissions', 'Daily vehicle cleaning'],
          excludes: ['Pooja materials & temple offerings', 'Hotel stay rooms', 'All lunch & dinner meals']
        },
        {
          title: 'Lonavala & Khandala Weekend',
          type: 'weekend',
          duration: '2 Days / 1 Night',
          price: 'Starting from ₹7,499',
          description: 'Explore the western ghats waterfalls, wax museums, and enjoy fresh chikki.',
          img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
          itinerary: [
            'Day 1 - Morning pickup. Drive through scenic Khandala Ghats. Visit Tiger Point.',
            'Day 1 - Check-in at Lonavala Hotel. Afternoon visit to Sunil Wax Museum.',
            'Day 2 - Visit Bhushi Dam, Karla Caves, and Bhaja Caves.',
            'Day 2 - Buy Lonavala Chikki. Start return trip. Late evening drop.'
          ],
          includes: ['AC Car (Sedan)', 'Toll taxes on Expressway', 'Fuel costs', 'Driver allowances'],
          excludes: ['Cave entrance fees', 'Food & snacks', 'Hotel stay rooms']
        }
      ];
      await Package.create(defaultPackages);
      console.log('Tour Packages Seeding Completed');
    }

    // 4. Seed Reviews
    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0) {
      const defaultReviews = [
        {
          name: 'Nilesh Gade',
          rating: 5,
          comment: 'I have used Shiv Tours and Travels on multiple occasions. On each journey the service was of top level. All the driving staff were extremely polite and very professional. The owner did keep in touch after journey to see everything went OK.',
          approved: true,
          date: '5 months ago',
          ownerReply: {
            name: 'Shiv Tours And Travels (owner)',
            date: '4 months ago',
            comment: 'Thank u for feedback sir...'
          }
        },
        {
          name: 'Suraj Chaudhari',
          rating: 5,
          comment: 'Excellent service. Clean car and the driver was very courteous. Our driver was rushikesh chaudhari',
          approved: true,
          date: '4 months ago'
        },
        {
          name: 'Kapil Gaikwad',
          rating: 5,
          comment: 'Driver n driving was so good. Happy with shiv tours and travels',
          approved: true,
          date: '4 months ago'
        },
        {
          name: 'Mayura G',
          rating: 5,
          comment: 'Clean vehicle and polite driver. Made our Nashik outstation family trip extremely memorable and stress-free.',
          approved: true,
          date: '4 months ago'
        }
      ];
      await Review.create(defaultReviews);
      console.log('Customer Reviews Seeding Completed');
    }
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
  }
};
