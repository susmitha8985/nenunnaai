insert into doctors (name,specialty,qualification,experience,clinic,consultation_fee,rating)
values
('Dr. Ananya Rao','General Physician','MBBS, MD',8,'NENUNNA Health Clinic',600,4.8),
('Dr. Kiran Kumar','Cardiologist','MBBS, MD, DM',12,'City Heart Centre',1000,4.9),
('Dr. Meera Sharma','Dermatologist','MBBS, MD',7,'Skin & Care Clinic',800,4.7),
('Dr. Ravi Teja','Pediatrician','MBBS, DCH',10,'Little Stars Clinic',700,4.8),
('Dr. Priya Nair','Gynecologist','MBBS, MS',9,'WomenCare Centre',900,4.9)
on conflict do nothing;

insert into lab_tests (name,description,category,price,discount,sample_type,report_delivery_time)
values
('Complete Blood Count (CBC)','Routine blood health screening','Blood Tests',450,50,'Blood','24 hours'),
('Diabetes Screening','Blood glucose assessment','Diabetes',350,25,'Blood','12 hours'),
('Thyroid Profile','T3, T4 and TSH','Thyroid',650,50,'Blood','24 hours'),
('Lipid Profile','Cholesterol and triglyceride assessment','Heart',700,100,'Blood','24 hours'),
('Full Body Checkup','Comprehensive preventive package','Full Body Checkups',1999,300,'Blood/Urine','48 hours')
on conflict do nothing;