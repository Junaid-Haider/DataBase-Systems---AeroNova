require('dotenv').config();
const { sequelize, Airport, Aircraft, Flight, Schedule } = require('./models');

const airports = [
  { IATACode: 'LHR', AirportName: 'Heathrow Airport', City: 'London', Country: 'United Kingdom', Timezone: 'Europe/London', Terminal: 'T5', GateNo: 'A1', Status: 'ACTIVE', HasCustoms: 1 },
  { IATACode: 'JFK', AirportName: 'John F. Kennedy Intl', City: 'New York', Country: 'United States', Timezone: 'America/New_York', Terminal: 'T4', GateNo: 'B2', Status: 'ACTIVE', HasCustoms: 1 },
  { IATACode: 'DXB', AirportName: 'Dubai Intl Airport', City: 'Dubai', Country: 'UAE', Timezone: 'Asia/Dubai', Terminal: 'T3', GateNo: 'C3', Status: 'ACTIVE', HasCustoms: 1 },
  { IATACode: 'SIN', AirportName: 'Changi Airport', City: 'Singapore', Country: 'Singapore', Timezone: 'Asia/Singapore', Terminal: 'T1', GateNo: 'D4', Status: 'ACTIVE', HasCustoms: 1 },
  { IATACode: 'HND', AirportName: 'Haneda Airport', City: 'Tokyo', Country: 'Japan', Timezone: 'Asia/Tokyo', Terminal: 'T2', GateNo: 'E5', Status: 'ACTIVE', HasCustoms: 1 },
  { IATACode: 'CDG', AirportName: 'Charles de Gaulle', City: 'Paris', Country: 'France', Timezone: 'Europe/Paris', Terminal: 'T2E', GateNo: 'F6', Status: 'ACTIVE', HasCustoms: 1 },
  { IATACode: 'IST', AirportName: 'Istanbul Airport', City: 'Istanbul', Country: 'Turkey', Timezone: 'Europe/Istanbul', Terminal: 'T1', GateNo: 'G7', Status: 'ACTIVE', HasCustoms: 1 },
  { IATACode: 'LAX', AirportName: 'Los Angeles Intl', City: 'Los Angeles', Country: 'United States', Timezone: 'America/Los_Angeles', Terminal: 'TB', GateNo: 'H8', Status: 'ACTIVE', HasCustoms: 1 },
  { IATACode: 'ISB', AirportName: 'Islamabad Intl', City: 'Islamabad', Country: 'Pakistan', Timezone: 'Asia/Karachi', Terminal: 'T1', GateNo: 'J9', Status: 'ACTIVE', HasCustoms: 1 },
  { IATACode: 'KHI', AirportName: 'Jinnah Intl Airport', City: 'Karachi', Country: 'Pakistan', Timezone: 'Asia/Karachi', Terminal: 'T1', GateNo: 'K1', Status: 'ACTIVE', HasCustoms: 1 },
  { IATACode: 'SYD', AirportName: 'Sydney Airport', City: 'Sydney', Country: 'Australia', Timezone: 'Australia/Sydney', Terminal: 'T1', GateNo: 'L2', Status: 'ACTIVE', HasCustoms: 1 },
  { IATACode: 'FRA', AirportName: 'Frankfurt Airport', City: 'Frankfurt', Country: 'Germany', Timezone: 'Europe/Berlin', Terminal: 'T1', GateNo: 'M3', Status: 'ACTIVE', HasCustoms: 1 },
  { IATACode: 'BKK', AirportName: 'Suvarnabhumi Airport', City: 'Bangkok', Country: 'Thailand', Timezone: 'Asia/Bangkok', Terminal: 'T1', GateNo: 'N4', Status: 'ACTIVE', HasCustoms: 1 },
  { IATACode: 'DOH', AirportName: 'Hamad Intl Airport', City: 'Doha', Country: 'Qatar', Timezone: 'Asia/Qatar', Terminal: 'T1', GateNo: 'P5', Status: 'ACTIVE', HasCustoms: 1 },
  { IATACode: 'ORD', AirportName: "O'Hare Intl Airport", City: 'Chicago', Country: 'United States', Timezone: 'America/Chicago', Terminal: 'T5', GateNo: 'Q6', Status: 'ACTIVE', HasCustoms: 1 },
];

const aircraftList = [
  { RegNumber: 'AN-001', Model: 'Boeing 777-300ER', Capacity: 396, MfgYear: 2020, AircraftType: 'WIDE-BODY', NumAisles: 2, MaxSeats: 396, CargoVol_m3: 200, MaxPayload_kg: 69850 },
  { RegNumber: 'AN-002', Model: 'Airbus A380-800', Capacity: 525, MfgYear: 2019, AircraftType: 'WIDE-BODY', NumAisles: 2, MaxSeats: 525, CargoVol_m3: 300, MaxPayload_kg: 83000 },
  { RegNumber: 'AN-003', Model: 'Boeing 787-9', Capacity: 296, MfgYear: 2021, AircraftType: 'WIDE-BODY', NumAisles: 2, MaxSeats: 296, CargoVol_m3: 150, MaxPayload_kg: 52800 },
  { RegNumber: 'AN-004', Model: 'Airbus A350-900', Capacity: 325, MfgYear: 2022, AircraftType: 'WIDE-BODY', NumAisles: 2, MaxSeats: 325, CargoVol_m3: 180, MaxPayload_kg: 53000 },
  { RegNumber: 'AN-005', Model: 'Boeing 737 MAX 8', Capacity: 189, MfgYear: 2023, AircraftType: 'NARROW-BODY', NumAisles: 1, MaxSeats: 189, CargoVol_m3: 50, MaxPayload_kg: 20900 },
  { RegNumber: 'AN-006', Model: 'Airbus A321neo', Capacity: 220, MfgYear: 2022, AircraftType: 'NARROW-BODY', NumAisles: 1, MaxSeats: 220, CargoVol_m3: 60, MaxPayload_kg: 25500 },
  { RegNumber: 'AN-007', Model: 'Boeing 777-200LR', Capacity: 317, MfgYear: 2018, AircraftType: 'WIDE-BODY', NumAisles: 2, MaxSeats: 317, CargoVol_m3: 190, MaxPayload_kg: 64000 },
  { RegNumber: 'AN-008', Model: 'Airbus A330-900', Capacity: 287, MfgYear: 2021, AircraftType: 'WIDE-BODY', NumAisles: 2, MaxSeats: 287, CargoVol_m3: 160, MaxPayload_kg: 46000 },
];

// Generate flight routes
const routes = [
  // From LHR
  { from: 'LHR', to: 'JFK', durH: 8, durM: 15, fare: { ECONOMY: 420, BUSINESS: 1800, FIRST: 5200 } },
  { from: 'LHR', to: 'DXB', durH: 7, durM: 0, fare: { ECONOMY: 380, BUSINESS: 1600, FIRST: 4500 } },
  { from: 'LHR', to: 'SIN', durH: 12, durM: 45, fare: { ECONOMY: 550, BUSINESS: 2400, FIRST: 6800 } },
  { from: 'LHR', to: 'LAX', durH: 11, durM: 30, fare: { ECONOMY: 480, BUSINESS: 2000, FIRST: 5800 } },
  { from: 'LHR', to: 'CDG', durH: 1, durM: 15, fare: { ECONOMY: 120, BUSINESS: 450, FIRST: 1200 } },
  { from: 'LHR', to: 'IST', durH: 4, durM: 0, fare: { ECONOMY: 220, BUSINESS: 900, FIRST: 2600 } },
  { from: 'LHR', to: 'FRA', durH: 1, durM: 45, fare: { ECONOMY: 150, BUSINESS: 550, FIRST: 1500 } },
  // From JFK
  { from: 'JFK', to: 'LHR', durH: 7, durM: 30, fare: { ECONOMY: 420, BUSINESS: 1800, FIRST: 5200 } },
  { from: 'JFK', to: 'LAX', durH: 5, durM: 30, fare: { ECONOMY: 280, BUSINESS: 900, FIRST: 2800 } },
  { from: 'JFK', to: 'CDG', durH: 7, durM: 45, fare: { ECONOMY: 400, BUSINESS: 1700, FIRST: 5000 } },
  { from: 'JFK', to: 'DXB', durH: 12, durM: 30, fare: { ECONOMY: 600, BUSINESS: 2600, FIRST: 7500 } },
  { from: 'JFK', to: 'ORD', durH: 2, durM: 45, fare: { ECONOMY: 180, BUSINESS: 650, FIRST: 1800 } },
  // From DXB
  { from: 'DXB', to: 'LHR', durH: 7, durM: 15, fare: { ECONOMY: 380, BUSINESS: 1600, FIRST: 4500 } },
  { from: 'DXB', to: 'SIN', durH: 7, durM: 30, fare: { ECONOMY: 350, BUSINESS: 1400, FIRST: 4000 } },
  { from: 'DXB', to: 'ISB', durH: 3, durM: 15, fare: { ECONOMY: 200, BUSINESS: 750, FIRST: 2000 } },
  { from: 'DXB', to: 'KHI', durH: 2, durM: 45, fare: { ECONOMY: 180, BUSINESS: 650, FIRST: 1800 } },
  { from: 'DXB', to: 'BKK', durH: 6, durM: 15, fare: { ECONOMY: 320, BUSINESS: 1200, FIRST: 3500 } },
  { from: 'DXB', to: 'DOH', durH: 1, durM: 15, fare: { ECONOMY: 100, BUSINESS: 400, FIRST: 1000 } },
  // From SIN
  { from: 'SIN', to: 'HND', durH: 7, durM: 0, fare: { ECONOMY: 350, BUSINESS: 1400, FIRST: 4000 } },
  { from: 'SIN', to: 'SYD', durH: 8, durM: 0, fare: { ECONOMY: 400, BUSINESS: 1600, FIRST: 4600 } },
  { from: 'SIN', to: 'BKK', durH: 2, durM: 30, fare: { ECONOMY: 150, BUSINESS: 550, FIRST: 1500 } },
  { from: 'SIN', to: 'DXB', durH: 7, durM: 30, fare: { ECONOMY: 350, BUSINESS: 1400, FIRST: 4000 } },
  // From CDG
  { from: 'CDG', to: 'IST', durH: 3, durM: 30, fare: { ECONOMY: 200, BUSINESS: 800, FIRST: 2200 } },
  { from: 'CDG', to: 'JFK', durH: 8, durM: 30, fare: { ECONOMY: 400, BUSINESS: 1700, FIRST: 5000 } },
  { from: 'CDG', to: 'DXB', durH: 6, durM: 30, fare: { ECONOMY: 350, BUSINESS: 1400, FIRST: 4000 } },
  { from: 'CDG', to: 'FRA', durH: 1, durM: 15, fare: { ECONOMY: 100, BUSINESS: 380, FIRST: 950 } },
  // From ISB
  { from: 'ISB', to: 'DXB', durH: 3, durM: 0, fare: { ECONOMY: 200, BUSINESS: 750, FIRST: 2000 } },
  { from: 'ISB', to: 'IST', durH: 5, durM: 30, fare: { ECONOMY: 280, BUSINESS: 1100, FIRST: 3000 } },
  { from: 'ISB', to: 'KHI', durH: 1, durM: 45, fare: { ECONOMY: 80, BUSINESS: 300, FIRST: 800 } },
  { from: 'ISB', to: 'LHR', durH: 8, durM: 30, fare: { ECONOMY: 450, BUSINESS: 1900, FIRST: 5500 } },
  // From HND
  { from: 'HND', to: 'SIN', durH: 7, durM: 15, fare: { ECONOMY: 350, BUSINESS: 1400, FIRST: 4000 } },
  { from: 'HND', to: 'LAX', durH: 10, durM: 0, fare: { ECONOMY: 500, BUSINESS: 2200, FIRST: 6200 } },
  { from: 'HND', to: 'SYD', durH: 9, durM: 30, fare: { ECONOMY: 450, BUSINESS: 1900, FIRST: 5500 } },
  // From LAX
  { from: 'LAX', to: 'JFK', durH: 5, durM: 15, fare: { ECONOMY: 280, BUSINESS: 900, FIRST: 2800 } },
  { from: 'LAX', to: 'HND', durH: 11, durM: 0, fare: { ECONOMY: 500, BUSINESS: 2200, FIRST: 6200 } },
  { from: 'LAX', to: 'SYD', durH: 15, durM: 0, fare: { ECONOMY: 700, BUSINESS: 3000, FIRST: 8500 } },
  { from: 'LAX', to: 'ORD', durH: 4, durM: 0, fare: { ECONOMY: 200, BUSINESS: 700, FIRST: 2000 } },
  // From SYD
  { from: 'SYD', to: 'SIN', durH: 8, durM: 15, fare: { ECONOMY: 400, BUSINESS: 1600, FIRST: 4600 } },
  { from: 'SYD', to: 'LAX', durH: 14, durM: 30, fare: { ECONOMY: 700, BUSINESS: 3000, FIRST: 8500 } },
  // From FRA
  { from: 'FRA', to: 'JFK', durH: 8, durM: 45, fare: { ECONOMY: 430, BUSINESS: 1800, FIRST: 5300 } },
  { from: 'FRA', to: 'DXB', durH: 6, durM: 0, fare: { ECONOMY: 330, BUSINESS: 1300, FIRST: 3800 } },
  { from: 'FRA', to: 'SIN', durH: 12, durM: 0, fare: { ECONOMY: 520, BUSINESS: 2200, FIRST: 6400 } },
  // From BKK
  { from: 'BKK', to: 'HND', durH: 6, durM: 0, fare: { ECONOMY: 300, BUSINESS: 1200, FIRST: 3400 } },
  { from: 'BKK', to: 'SYD', durH: 9, durM: 30, fare: { ECONOMY: 420, BUSINESS: 1700, FIRST: 4800 } },
  // From DOH
  { from: 'DOH', to: 'LHR', durH: 7, durM: 0, fare: { ECONOMY: 370, BUSINESS: 1500, FIRST: 4300 } },
  { from: 'DOH', to: 'ISB', durH: 3, durM: 30, fare: { ECONOMY: 220, BUSINESS: 850, FIRST: 2200 } },
  // From ORD
  { from: 'ORD', to: 'LHR', durH: 8, durM: 0, fare: { ECONOMY: 440, BUSINESS: 1850, FIRST: 5400 } },
  { from: 'ORD', to: 'FRA', durH: 9, durM: 0, fare: { ECONOMY: 460, BUSINESS: 1900, FIRST: 5600 } },
  // From KHI
  { from: 'KHI', to: 'DXB', durH: 2, durM: 30, fare: { ECONOMY: 180, BUSINESS: 650, FIRST: 1800 } },
  { from: 'KHI', to: 'IST', durH: 6, durM: 0, fare: { ECONOMY: 300, BUSINESS: 1200, FIRST: 3400 } },
  // From IST
  { from: 'IST', to: 'LHR', durH: 4, durM: 0, fare: { ECONOMY: 220, BUSINESS: 900, FIRST: 2600 } },
  { from: 'IST', to: 'DXB', durH: 4, durM: 30, fare: { ECONOMY: 250, BUSINESS: 1000, FIRST: 2800 } },
];

const depTimes = ['06:00', '07:30', '08:45', '10:00', '11:15', '13:00', '14:30', '16:00', '17:45', '19:00', '20:30', '22:00'];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected');

    // Seed airports
    const airportMap = {};
    for (const a of airports) {
      const [ap] = await Airport.findOrCreate({ where: { IATACode: a.IATACode }, defaults: a });
      airportMap[a.IATACode] = ap.AirportID;
    }
    console.log(`✅ ${Object.keys(airportMap).length} airports ready`);

    // Seed aircraft
    const aircraftIds = [];
    for (const ac of aircraftList) {
      const [plane] = await Aircraft.findOrCreate({ where: { RegNumber: ac.RegNumber }, defaults: ac });
      aircraftIds.push(plane.AircraftID);
    }
    console.log(`✅ ${aircraftIds.length} aircraft ready`);

    // Seed flights across multiple dates
    const baseDates = [];
    const today = new Date();
    for (let d = 0; d < 14; d++) {
      const dt = new Date(today);
      dt.setDate(dt.getDate() + d);
      baseDates.push(dt.toISOString().split('T')[0]);
    }

    let flightCount = 0;
    let flightNum = 100;

    for (const route of routes) {
      const depId = airportMap[route.from];
      const arrId = airportMap[route.to];
      if (!depId || !arrId) continue;

      // Pick 1 date per route from first 7 days
      const dateIdx = flightCount % 7;
      const depDate = baseDates[dateIdx];
      const depTime = depTimes[flightCount % depTimes.length];
      const aircraftId = aircraftIds[flightCount % aircraftIds.length];
      const flightNo = `AN${String(flightNum).padStart(4, '0')}`;
      flightNum++;

      const isIntl = route.from !== route.to;
      const arrMinutes = (parseInt(depTime.split(':')[0]) * 60 + parseInt(depTime.split(':')[1]) + route.durH * 60 + route.durM) % 1440;
      const arrTime = `${String(Math.floor(arrMinutes / 60)).padStart(2, '0')}:${String(arrMinutes % 60).padStart(2, '0')}`;

      const [flight, created] = await Flight.findOrCreate({
        where: { FlightNo: flightNo },
        defaults: {
          FlightNo: flightNo,
          DepDate: depDate,
          Status: 'SCHEDULED',
          Duration_Hours: route.durH,
          Duration_Minutes: route.durM,
          FlightType: 'INTERNATIONAL',
          AircraftID: aircraftId,
          DepAirportID: depId,
          ArrAirportID: arrId,
          OverflightPermit: 1,
          CustomsRequired: 1,
          BaseFare: JSON.stringify(route.fare),
        }
      });

      if (created) {
        const dayOfWeek = new Date(depDate).getDay() || 7;
        await Schedule.findOrCreate({
          where: { FlightID: flight.FlightID, EffDate: depDate },
          defaults: {
            FlightID: flight.FlightID,
            EffDate: depDate,
            DayOfWeek: dayOfWeek,
            DepTime_Time: depTime + ':00',
            DepTime_TimeZone: 'UTC',
            ArrTime_Time: arrTime + ':00',
            ArrTime_TimeZone: 'UTC',
            Frequency: 'DAILY',
            SchedType: 'SCHEDULED',
          }
        });
      }

      flightCount++;
    }

    console.log(`✅ ${flightCount} flights seeded across 7 days`);
    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();
