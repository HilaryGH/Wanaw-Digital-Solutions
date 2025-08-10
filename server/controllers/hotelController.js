const HotelRoom = require('../models/HotelRoom');

exports.checkAvailability = async (req, res) => {
  try {
    const { checkInDate, checkOutDate, guests, roomPref } = req.body;

    if (!checkInDate || !checkOutDate || !guests) {
      return res.status(400).json({ status: 'Error', message: 'Missing required fields' });
    }

    // Find rooms matching preference & capacity
    const rooms = await HotelRoom.find({
      capacity: { $gte: guests },
      ...(roomPref ? { type: roomPref } : {})
    });

    if (!rooms.length) {
      return res.json({
        status: 'Booked',
        availableRooms: 0,
        message: 'No rooms match the search criteria'
      });
    }

    // Check date overlaps
    const availableRoom = rooms.find(room => {
      return !room.bookedDates.some(booking =>
        !(new Date(checkOutDate) <= booking.checkIn || new Date(checkInDate) >= booking.checkOut)
      );
    });

    if (availableRoom) {
      return res.json({
        status: 'Available',
        availableRooms: 1,
        roomType: availableRoom.type,
        message: 'Room is available'
      });
    } else {
      return res.json({
        status: 'Booked',
        availableRooms: 0,
        message: 'No rooms available for the selected dates'
      });
    }
  } catch (err) {
    console.error('Availability check error:', err);
    res.status(500).json({ status: 'Error', message: 'Server error' });
  }
};
