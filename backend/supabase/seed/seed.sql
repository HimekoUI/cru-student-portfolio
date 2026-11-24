-- Seed default CRU Skill Framework (6 core skills)
INSERT INTO public.skills (name, category, description) VALUES
  ('การสื่อสาร', 'communication', 'การนำเสนอและการสื่อสารเชิงวิชาชีพ'),
  ('ทีมเวิร์ก', 'teamwork', 'การทำงานร่วมกับผู้อื่นและการประสานงาน'),
  ('วิเคราะห์', 'hard_skill', 'การคิดวิเคราะห์และแก้ปัญหาอย่างเป็นระบบ'),
  ('ดิจิทัล', 'hard_skill', 'ทักษะการใช้เทคโนโลยีและเครื่องมือดิจิทัล'),
  ('ผู้นำ', 'leadership', 'ภาวะผู้นำและการบริหารจัดการทีม'),
  ('รับผิดชอบ', 'soft_skill', 'ความรับผิดชอบต่อหน้าที่และจริยธรรม')
ON CONFLICT (name) DO NOTHING;
