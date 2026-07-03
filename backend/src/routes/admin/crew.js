const express = require('express');
const { requireAdmin } = require('../../middleware/admin');
const { Crew, Employee, Person, Pilot, CabinCrew, FlightCrewAssignment, Flight } = require('../../models');

const router = express.Router();

// GET all crew members
router.get('/', requireAdmin, async (req, res) => {
  try {
    const crewMembers = await Crew.findAll({
      include: [
        {
          model: Employee,
          as: 'employee',
          include: [
            {
              model: Person,
              as: 'person',
              attributes: ['FirstName', 'LastName', 'Email', 'Phone', 'Nationality']
            }
          ]
        },
        { model: Pilot, as: 'pilotDetails' },
        { model: CabinCrew, as: 'cabinCrewDetails' }
      ]
    });

    const formatted = crewMembers.map(c => {
      const p = c.employee?.person;
      return {
        id: c.CrewID,
        name: p ? `${p.FirstName} ${p.LastName}` : 'Unknown',
        role: c.Role,
        email: p?.Email || 'N/A',
        phone: p?.Phone || 'N/A',
        nationality: p?.Nationality || 'N/A',
        license: c.LicenseNo || 'N/A',
        medicalCert: c.MedCert || 'N/A',
        hireDate: c.employee?.HireDate || 'N/A',
        pilotDetails: c.pilotDetails || null,
        cabinCrewDetails: c.cabinCrewDetails || null
      };
    });

    res.json({ data: formatted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new crew member
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, nationality, dob, gender,
            salary, department, role, licenseNo, medCert } = req.body;

    // 1. Create Person
    const person = await Person.create({
      FirstName: firstName, LastName: lastName, Email: email,
      Phone: phone, Nationality: nationality, DateOfBirth: dob,
      Gender: gender || 'PREFER_NOT'
    });

    // 2. Create Employee
    const employee = await Employee.create({
      EmployeeID: person.PersonID, Salary: salary || 0,
      HireDate: new Date(), Department: department || 'Flight Operations',
      Role: 'CREW'
    });

    // 3. Create Crew
    const crew = await Crew.create({
      CrewID: employee.EmployeeID, Role: role,
      LicenseNo: licenseNo, MedCert: medCert
    });

    res.status(201).json({ message: 'Crew member created', crew });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update crew member
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const crew = await Crew.findByPk(req.params.id);
    if (!crew) return res.status(404).json({ error: 'Crew member not found' });

    const { role, licenseNo, medCert } = req.body;
    if (role) crew.Role = role;
    if (licenseNo) crew.LicenseNo = licenseNo;
    if (medCert) crew.MedCert = medCert;
    await crew.save();

    res.json({ message: 'Crew member updated', crew });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET crew member schedule (flight assignments)
router.get('/:id/schedule', requireAdmin, async (req, res) => {
  try {
    const crew = await Crew.findByPk(req.params.id, {
      include: [{ model: Flight, as: 'assignedFlights' }]
    });
    if (!crew) return res.status(404).json({ error: 'Crew member not found' });

    res.json({ data: crew.assignedFlights || [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
