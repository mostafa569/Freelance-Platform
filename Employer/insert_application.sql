-- إنشاء تطبيق مرتبط بالوظيفة رقم 4 (Laravel Developer)
INSERT INTO applications (
  job_id,
  candidate_id,
  status,
  applied_at
) VALUES (
  4,                                         
  '1',                             
  'pending',                                  
  NOW()                                      
);