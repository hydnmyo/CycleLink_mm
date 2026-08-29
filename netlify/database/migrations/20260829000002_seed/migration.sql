INSERT INTO "businesses" ("identity_user_id", "name", "industry", "city", "email", "created_at") VALUES
  ('seed-thilawa-packaging', 'Thilawa Packaging Co.', 'Packaging', 'Thilawa SEZ', 'surplus@thilawapack.mm', '2026-07-01 00:00:00'),
  ('seed-yangon-recycle', 'Yangon Recycle Hub', 'Recycling', 'Yangon', 'trade@yangonrecycle.mm', '2026-07-02 00:00:00'),
  ('seed-hlaing-garment', 'Hlaing Garment Works', 'Textiles', 'Yangon', 'factory@hlainggarment.mm', '2026-07-03 00:00:00'),
  ('seed-mandalay-metal', 'Mandalay Metalworks', 'Metal fabrication', 'Mandalay', 'sales@mdymetal.mm', '2026-07-04 00:00:00'),
  ('seed-bago-industrial', 'Bago Industrial Supply', 'Machinery', 'Bago', 'parts@bagoindustrial.mm', '2026-07-05 00:00:00'),
  ('seed-irrawaddy-plastics', 'Irrawaddy Plastics', 'Plastic processing', 'Yangon', 'orders@irrawaddyplastics.mm', '2026-07-06 00:00:00'),
  ('seed-ava-textile', 'Ava Textile Mill', 'Textiles', 'Mandalay', 'mill@avatextile.mm', '2026-07-07 00:00:00'),
  ('seed-sittaung-steel', 'Sittaung Steel', 'Metal fabrication', 'Bago', 'yard@sittaungsteel.mm', '2026-07-08 00:00:00');

INSERT INTO "listings" ("business_id", "title", "description", "category", "subcategory", "quantity", "unit", "price_mmk", "condition", "city", "created_at") VALUES
  (1, 'HDPE drum scrap — food-grade offcuts', 'Clean HDPE drum and jerrycan scrap from a packaging line in Thilawa SEZ. Material is sorted, rinsed, and baled. Suitable for pelletizing or drum remanufacture. No mixed resins.', 'plastic', 'HDPE', 2.50, 'ton', 1850000, 'scrap', 'Thilawa SEZ', '2026-08-12 04:00:00'),
  (2, 'Washed PET bottle flakes', 'Hot-washed PET flakes from post-consumer bottles collected in Yangon. Moisture under 1%. Clear and light-blue mix. Ready for fiber or sheet extrusion.', 'plastic', 'PET', 1.20, 'ton', 2400000, 'scrap', 'Yangon', '2026-08-18 07:30:00'),
  (3, 'Cotton-blend garment offcuts', 'Cutting-room offcuts from a Hlaing Tharyar garment factory. Mostly cotton/poly blends in mixed colours. Suitable for shoddy, stuffing, or industrial wipers.', 'industrial', 'textile', 800, 'kg', 420000, 'scrap', 'Yangon', '2026-08-20 02:15:00'),
  (4, 'Stainless steel sheet offcuts', '304 stainless offcuts from sheet-metal fabrication. Mixed sizes, mill finish. No painted or galvanized material. Ideal for smaller fabricators short on local stock.', 'industrial', 'metal', 1.50, 'ton', 5600000, 'scrap', 'Mandalay', '2026-08-15 09:00:00'),
  (5, 'Unused conveyor belt sections', 'Unused rubber conveyor belt sections left after a line upgrade. 800 mm width, various lengths. Hardware not included. Stored under cover at a Bago industrial estate.', 'industrial', 'machinery', 12, 'piece', 980000, 'new', 'Bago', '2026-08-08 11:20:00'),
  (6, 'PP film roll surplus', 'Virgin-grade polypropylene film rolls from a change of spec. Natural colour, 25–40 micron. Partial rolls, remaining length documented per roll.', 'plastic', 'PP', 400, 'kg', 760000, 'new', 'Yangon', '2026-08-22 03:45:00'),
  (1, 'Mixed plastic packaging bales', 'Baled mixed packaging film and rigid plastic from export packing lines. Sorted away from food waste. Buyer should plan a secondary sort.', 'plastic', 'mixed', 3.00, 'ton', 990000, 'scrap', 'Thilawa SEZ', '2026-08-05 06:10:00'),
  (6, 'Stretch film offcuts', 'LLDPE stretch-film edge trim and short rolls. Clean, dry, and boxed. Good feedstock for film recyclers in Yangon.', 'plastic', 'film', 250, 'kg', 310000, 'scrap', 'Yangon', '2026-08-21 08:00:00'),
  (7, 'Denim cutting waste', 'Indigo denim cuttings from a Mandalay mill finishing line. Cotton-rich. Packed in 25 kg sacks. Useful for recycled yarn or insulation.', 'industrial', 'textile', 600, 'kg', 360000, 'scrap', 'Mandalay', '2026-08-14 01:40:00'),
  (8, 'Mild steel plate offcuts', 'Mild steel offcuts from plate cutting. Thickness 4–10 mm. Oil-free. Available for collection from a Bago workshop this month.', 'industrial', 'metal', 2.00, 'ton', 2100000, 'scrap', 'Bago', '2026-08-11 10:05:00'),
  (2, 'HDPE bottle crates — used but sound', 'Used HDPE bottle crates, standard 24-bottle footprint. Washed. A few hairline cracks noted on fewer than 5% of units.', 'plastic', 'HDPE', 180, 'piece', 540000, 'used', 'Yangon', '2026-08-19 05:25:00'),
  (5, 'Motor housing surplus', 'Unused cast motor housings from a cancelled OEM order. Stored indoors. Drawings available on request.', 'industrial', 'machinery', 8, 'piece', 1280000, 'new', 'Bago', '2026-08-09 12:00:00'),
  (1, 'PET preform rejects', 'Off-spec PET preforms from a blow-moulding trial. Clear grade. Suitable for grinding back into flake.', 'plastic', 'PET', 500, 'kg', 650000, 'scrap', 'Thilawa SEZ', '2026-08-17 14:30:00'),
  (3, 'Cotton yarn remnants', 'Cone-end cotton yarn remnants, mixed counts. Dry stored. Useful for smaller weaving shops or recycled-yarn lines.', 'industrial', 'textile', 320, 'kg', 280000, 'used', 'Yangon', '2026-08-16 03:10:00'),
  (4, 'Aluminum extrusion scrap', 'Clean aluminum extrusion offcuts and punch scrap. No steel attachments. Sorted by alloy family on request.', 'industrial', 'metal', 900, 'kg', 3200000, 'scrap', 'Mandalay', '2026-08-13 06:50:00');
