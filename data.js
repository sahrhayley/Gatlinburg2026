window.GATLINBURG_CATEGORIES = [{"name":"Attractions & experiences","emoji":"🎢"},{"name":"Games, rides & entertainment","emoji":"🎮"},{"name":"Nature & scenic adventures","emoji":"🌲"},{"name":"Restaurants","emoji":"🍽️"},{"name":"Desserts & treats","emoji":"🍩"},{"name":"Christmas & seasonal activities","emoji":"🎄"},{"name":"Shopping & exploring","emoji":"🛍️"},{"name":"Adults","emoji":"🍹"}];
const dessertNames = new Set([
  "The Donut Friar","Ole Smoky Candy Kitchen","The Crazy Mason Milkshake Bar",
  "Byrd's Famous Cookies","Gatlinburg Goo Goo Chocolate Co.",
  "Maddog's Creamery & Donuts","Glades Soda Fountain"
]);
const legacyTypeMap = {
  "Outdoor adventures":"Attractions & experiences",
  "Theme parks":"Attractions & experiences",
  "Museums & exhibits":"Attractions & experiences",
  "Animals":"Attractions & experiences",
  "Games & rides":"Games, rides & entertainment",
  "Water & snow":"Games, rides & entertainment",
  "Shows":"Games, rides & entertainment",
  "Scenic spots":"Nature & scenic adventures",
  "Shopping":"Shopping & exploring",
  "Food & treats":"Restaurants",
  "Seasonal":"Christmas & seasonal activities",
  "Adults":"Adults"
};
window.gatlinburgCategoryName = (oldType,name) => {
  if (window.GATLINBURG_CATEGORIES.some(c=>c.name===oldType))return oldType;
  if (dessertNames.has(name))return "Desserts & treats";
  if (name==="Oconaluftee Elk Viewing")return "Nature & scenic adventures";
  return legacyTypeMap[oldType]||"Attractions & experiences";
};
window.GATLINBURG_ACTIVITIES = [
["Anakeesta","Outdoor adventures","🌲","Gatlinburg"],
["Gatlinburg SkyPark & SkyBridge","Outdoor adventures","🌉","Gatlinburg"],
["Ober Mountain","Outdoor adventures","🚡","Gatlinburg"],
["Dollywood","Theme parks","🎢","Pigeon Forge"],
["The Island in Pigeon Forge","Theme parks","🎡","Pigeon Forge"],
["WonderWorks","Museums & exhibits","🔬","Pigeon Forge"],
["Titanic Museum Attraction","Museums & exhibits","🚢","Pigeon Forge"],
["Alcatraz East Crime Museum","Museums & exhibits","🔎","Pigeon Forge"],
["Hollywood Star Cars Museum","Museums & exhibits","🏎️","Gatlinburg"],
["Hollywood Wax Museum","Museums & exhibits","🎭","Pigeon Forge"],
["Gatlinburg Space Needle","Scenic spots","🗼","Gatlinburg"],
["Beyond the Lens! Family Fun","Games & rides","🪐","Pigeon Forge"],
["XPERIA: Ocean Journey","Museums & exhibits","🐠","Sevierville"],
["Rainforest Adventures Discovery Zoo","Animals","🦜","Sevierville"],
["Smoky Mountain Deer Farm & Exotic Petting Zoo","Animals","🦌","Sevierville"],
["Indoor water park","Water & snow","💦","Sevierville"],
["Pigeon Forge Snow (indoor snow tubing)","Water & snow","❄️","Pigeon Forge"],
["Ripley's Aquarium of the Smokies","Animals","🦈","Gatlinburg"],
["Ripley's Believe It or Not!","Museums & exhibits","👀","Gatlinburg"],
["Ripley's Mirror Maze","Games & rides","🪞","Gatlinburg"],
["Ripley's Haunted Adventure","Games & rides","👻","Gatlinburg"],
["Ripley's Motion Blaster","Games & rides","🎮","Gatlinburg"],
["Ripley's Super Fun Zone","Games & rides","🔦","Gatlinburg"],
["Ripley's Davy Crockett Mini-Golf","Games & rides","⛳","Gatlinburg"],
["Ripley's Mountain Coaster","Games & rides","🎢","Gatlinburg"],
["Ripley's Super Fun Park","Games & rides","🏎️","Sevierville"],
["Ripley's Illusion Lab","Museums & exhibits","🌀","Gatlinburg"],
["Ripley's Old MacDonald's Farm Mini-Golf","Games & rides","⛳","Sevierville"],
["The Great Smoky Mountain Wheel","Games & rides","🎡","Pigeon Forge"],
["Gatlin's Mini Golf","Games & rides","⛳","Gatlinburg"],
["Crave Golf Club","Games & rides","🍭","Pigeon Forge"],
["Sky Pirates of Mermaid Bay","Games & rides","🏴‍☠️","Pigeon Forge"],
["Fannie Farkle's Arcade","Games & rides","🕹️","Gatlinburg"],
["Arcadia Arcade","Games & rides","🕹️","Gatlinburg"],
["Moonshine Mountain Coaster","Games & rides","🎢","Gatlinburg"],
["Smoky Mountain Alpine Coaster","Games & rides","🎢","Pigeon Forge"],
["Rocky Top Mountain Coaster","Games & rides","🎢","Pigeon Forge"],
["Goats on the Roof","Animals","🐐","Pigeon Forge"],
["SkyLand Ranch","Outdoor adventures","🐴","Sevierville"],
["TopJump Trampoline Park","Games & rides","🤸","Pigeon Forge"],
["Dolly Parton's Stampede","Shows","🐎","Pigeon Forge"],
["Pirates Voyage Dinner & Show","Shows","🏴‍☠️","Pigeon Forge"],
["Paula Deen's Lumberjack Feud","Shows","🪓","Pigeon Forge"],
["The Comedy Barn Theater","Shows","🎤","Pigeon Forge"],
["Hatfield & McCoy Dinner Feud","Shows","🍗","Pigeon Forge"],
["Cades Cove Wildlife Drive","Scenic spots","🦌","Great Smoky Mountains"],
["Newfound Gap Scenic Overlook","Scenic spots","🏔️","Great Smoky Mountains"],
["Kuwohi Observation Tower","Scenic spots","🌄","Great Smoky Mountains"],
["Roaring Fork Motor Nature Trail","Scenic spots","🌳","Gatlinburg"],
["Gatlinburg Trail","Scenic spots","🥾","Gatlinburg"],
["Sugarlands Visitor Center","Scenic spots","🌿","Great Smoky Mountains"],
["Foothills Parkway Scenic Drive","Scenic spots","🚙","Great Smoky Mountains"],
["Elkmont Ghost Town","Scenic spots","🏚️","Great Smoky Mountains"],
["Little River Road Scenic Drive","Scenic spots","🌲","Great Smoky Mountains"],
["Oconaluftee Elk Viewing","Animals","🫎","Cherokee"],
["The Sinks Waterfall","Scenic spots","💧","Great Smoky Mountains"],
["The Village Shops","Shopping","🛍️","Gatlinburg"],
["Great Smoky Arts & Crafts Community","Shopping","🎨","Gatlinburg"],
["The Old Mill Square","Shopping","🛍️","Pigeon Forge"],
["Tanger Outlets Sevierville","Shopping","🛍️","Sevierville"],
["The Incredible Christmas Place","Shopping","🎄","Pigeon Forge"],
["Three Bears General Store","Shopping","🐻","Pigeon Forge"],
["NOC Gatlinburg","Shopping","🥾","Gatlinburg"],
["The Mountain Mile","Shopping","🛍️","Pigeon Forge"],
["Crockett's Breakfast Camp","Food & treats","🥞","Gatlinburg"],
["Pancake Pantry","Food & treats","🥞","Gatlinburg"],
["The Old Mill Restaurant","Food & treats","🍽️","Pigeon Forge"],
["Applewood Farmhouse Restaurant","Food & treats","🍎","Sevierville"],
["Local Goat","Food & treats","🍔","Pigeon Forge"],
["Frizzle Chicken Cafe","Food & treats","🐔","Pigeon Forge"],
["The Peddler Steakhouse","Food & treats","🥩","Gatlinburg"],
["Bennett's Pit Bar-B-Que","Food & treats","🍖","Gatlinburg"],
["Mama's Farmhouse","Food & treats","🍽️","Pigeon Forge"],
["The Donut Friar","Food & treats","🍩","Gatlinburg"],
["Ole Smoky Candy Kitchen","Food & treats","🍬","Gatlinburg"],
["The Crazy Mason Milkshake Bar","Food & treats","🥤","Gatlinburg"],
["Byrd's Famous Cookies","Food & treats","🍪","Pigeon Forge"],
["Gatlinburg Goo Goo Chocolate Co.","Food & treats","🍫","Gatlinburg"],
["Maddog's Creamery & Donuts","Food & treats","🍨","Gatlinburg"],
["Glades Soda Fountain","Food & treats","🥤","Gatlinburg"],
["Gatlinburg Winter Magic Lights","Seasonal","✨","Gatlinburg"],
["Gatlinburg Snowpeople Scavenger Hunt","Seasonal","⛄","Gatlinburg"],
["Pigeon Forge Winterfest Lights","Seasonal","✨","Pigeon Forge"],
["Lights Over Gatlinburg at SkyPark","Seasonal","🌟","Gatlinburg"],
["Dollywood Smoky Mountain Christmas","Seasonal","🎄","Pigeon Forge"],
["Ole Smoky Moonshine Tasting (adults)","Adults","🥃","Gatlinburg"],
["Sugarlands Distilling Company Tasting (adults)","Adults","🥃","Gatlinburg"],
["Dick's Last Resort","Food & treats","🍔","Gatlinburg"],
["State Line (TN–NC)","Scenic spots","📍","Great Smoky Mountains"],
["Hangman's Dome","Games & rides","🎯","Gatlinburg"]
].map((a,i)=>({id:"default-"+(i+1),name:a[0],category:window.gatlinburgCategoryName(a[1],a[0]),emoji:a[2],area:a[3],photo:""}));
// First five attraction photos; the rest remain unchanged until reviewed.
const PHOTO_BATCH_1 = {
  "default-1": {
    "url": "https://cdn.tripster.com/media/product/gallery/original/Anakeesta_%2874547%29.jpg",
    "credit": "Tripster",
    "source": "https://www.tripster.com/detail/anakeesta-gatlinburg"
  },
  "default-2": {
    "url": "https://cdn.sanity.io/images/k8yfdmw9/gatlinburg/92a83ba4a9d499bacc7b172a5fb2d80a95794200-2856x2142.jpg?auto=format&h=975&q=70&w=1300",
    "credit": "Gatlinburg SkyPark",
    "source": "https://www.gatlinburgskypark.com/videos-and-photos"
  },
  "default-3": {
    "url": "https://assets.simpleviewinc.com/simpleview/image/upload/crm/gatlinburgtn/SMTram_470BEA2B-7BDD-4E3E-93F6A69E110CCFDD_e8599745-ba5a-41c0-87e1430d433d2021.jpg",
    "credit": "Gatlinburg tourism",
    "source": "https://www.gatlinburg.com/listing/the-gatlinburg-tram-at-ober-mountain/781/"
  },
  "default-4": {
    "url": "https://static.wixstatic.com/media/4c949a_3d5d322a32e040c4bb855349bb10014b~mv2.jpg/v1/fill/w_980%2Ch_658%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/4c949a_3d5d322a32e040c4bb855349bb10014b~mv2.jpg",
    "credit": "The Mindful Moderator",
    "source": "https://www.themindfulmoderator.com/post/how-to-get-the-most-bang-for-your-buck-in-gatlinburg-and-pigeon-forge"
  },
  "default-5": {
    "url": "https://pub-a4572e6ecae942889eeac3241a2da909.r2.dev/listings/the-island-in-pigeon-forge-pigeon-forge/7900e2fad0ce-1-full.webp",
    "credit": "The Smoky Mountains",
    "source": "https://www.thesmokymountains.com/listing/the-island-in-pigeon-forge-pigeon-forge"
  }
};
window.GATLINBURG_ACTIVITIES.forEach(activity => {
  const p = PHOTO_BATCH_1[activity.id];
  if(p) { activity.photo=p.url; activity.photoSource=p.source; activity.photoCredit=p.credit; }
});

// Place-specific photographs, collected from linked internet sources.
const PHOTO_BATCH_REST = {"6":["https://mediaim.expedia.com/place/8264/28f637b0-0808-485b-a6e5-fdd4998755bb.jpg","https://www.expedia.com/"],"7":["https://cdn.tripster.com/media/reviews/24224/images/20250825_085324.jpg","https://www.tripster.com/detail/titanic-museum-pigeon-forge"],"8":["https://smokymountainholiday.icnd-cdn.com/userfiles/B1EF81D9alcatraz-east-1619DC82-26AE-414F-A61F954F1625006A.jpg","https://www.smokymountainholiday.com/blog/rainy-day-activities-in-gatlinburg-and-pigeon-forge-for-families"],"9":["https://parkingingatlinburg.com/blog/images/cars-from-the-movies-1231.jpg","https://parkingingatlinburg.com/blog/exploring-the-star-cars-museum-gatlinburg.php"],"10":["https://cdn.getyourguide.com/image/format%3Dauto%2Cfit%3Dcrop%2Cgravity%3Dauto%2Cquality%3D60%2Cwidth%3D450%2Cheight%3D450%2Cdpr%3D2/tour_img/132b9e5c889e483181fd5ecfa2f07139ad26de9c7220f1b49ca627fbb36dd47b.jpeg","https://www.getyourguide.com/pigeon-forge-l1698/hollywood-wax-museum-entry-ticket-t1097092/"],"11":["https://www.hearthsidecabinrentals.com/media/69ea8079f9af7906877e5c2c/original.webp","https://www.hearthsidecabinrentals.com/blog/gatlinburg/gatlinburg-attractions/fun-things-to-do-in-gatlinburg-tn-at-night/"],"12":["https://i0.wp.com/media.tacdn.com/media/attractions-splice-spp-674x446/09/94/a5/87.jpg?ssl=1&w=1200","https://greatsmokyvacations.com/beyond-the-lens-in-the-foothills-of-the-great-smoky-mountains/"],"14":["https://cdn2.smokymountains.com/uploads/2021/02/Sevierville-Rainforest-Adventure-33.jpg","https://smokymountains.com/sevierville/things-to-do/rainforest-adventures"],"15":["https://dynamic-media-cdn.tripadvisor.com/media/photo-o/32/19/fc/fc/caption.jpg?h=1100&s=1&w=1100","https://www.tripadvisor.com/Attraction_Review-g55328-d1126958-Reviews-Smoky_Mountain_Deer_Farm_Exotic_Petting_Zoo-Sevierville_Tennessee.html"],"16":["https://www.mobilebrochure.com/smoky-mountains/wp-content/uploads/sites/1/2020/10/ridge-runner-watercoaster.jpg","https://www.mobilebrochure.com/smoky-mountains/brochure/rides-games/wilderness-at-the-smokies/"],"17":["https://www.attractionsofamerica.com/images/all_destinations/20230317001145_pigeon-forge-snow.jpg","https://www.attractionsofamerica.com/attractions/pigeon-forge-attractions.php"],"18":["https://assets.simpleviewinc.com/simpleview/image/upload/c_fill%2Ch_800%2Cq_75%2Cw_1200/v1/clients/gatlinburgtn/Ripley_s_Aquarium_1efcdba3-4d79-4da8-b433-5aa0f3ee0247.jpg","https://www.gatlinburg.com/blog/post/fall-into-fun-with-these-family-friendly-activities-in-gatlinburg/"],"19":["https://liltravelfolks.com/wp-content/uploads/2022/07/Ripleys-Believe-It-Or-Not-Odditorium-scaled.jpg","https://liltravelfolks.com/ripleys-attractions-in-gatlinburg/"],"20":["https://cdn2.smokymountains.com/uploads/2020/08/Gatlinburg-Ripleys-Mirror-Maze-3.jpg","https://smokymountains.com/gatlinburg/things-to-do/ripleys-mirror-maze"],"21":["https://assets.simpleviewinc.com/simpleview/image/upload/c_fill%2Cf_jpg%2Ch_400%2Cq_65%2Cw_583/v1/crm/gatlinburgtn/RHA-Building1-84e3f4385056a36_84e3f559-5056-a36f-233ce95811bf2891.jpg","https://www.gatlinburg.com/listing/ripleys-haunted-adventure/334/"],"22":["https://www.gatlinburg-attractions.com/content/uploads/Ripley-Motion-Blaster.jpg","https://www.gatlinburg-attractions.com/attraction/ripleys-motion-blaster/"],"23":["https://assets.simpleviewinc.com/simpleview/image/upload/crm/gatlinburgtn/DSC083860-851ffc955056a36_851ffd5d-5056-a36f-230107f7344116a4.jpg","https://www.gatlinburg.com/listing/ripleys-super-fun-zone/758/"],"24":["https://wp-cdn-gatlinburg-attractions.s3.amazonaws.com/prod/uploads/davy-crokett-mini-golf-img05.jpg","https://www.gatlinburg-attractions.com/attraction/ripleys-davy-crockett-mini-golf/"],"25":["https://assets.simpleviewinc.com/simpleview/image/upload/c_limit%2Cq_75%2Cw_1200/v1/crm/gatlinburgtn/FatherDaughter3Copy_5CE2C721-5473-49B2-B7EA0BA894E279D4_c9ba8501-4872-4e40-970c63011442d983.jpg","https://www.gatlinburg.com/listing/ripleys-mountain-coaster/224/"],"29":["https://www.mobilebrochure.com/smoky-mountains/wp-content/uploads/sites/1/2021/04/pigeon-forge-shopping-1024x684.png","https://www.mobilebrochure.com/smoky-mountains/mobile-explorer/shopping/top-places-to-shop-in-the-smokies/"],"31":["https://www.cravegolf.com/media/684bc5021a9e8c5d929655a7/large.webp","https://www.cravegolf.com/news-press/make-mini-golf-game-sweeter-crave-style"],"34":["https://assets.simpleviewinc.com/simpleview/image/upload/c_limit%2Cq_75%2Cw_1200/v1/crm/gatlinburgtn/Arcadia-12_410CCD11-A400-4294-A512BACC9469A654_fba5c35e-d428-447f-9722456d24dd059d.jpg","https://www.gatlinburg.com/listing/arcadia/350/"],"35":["https://assets.simpleviewinc.com/simpleview/image/upload/crm/gatlinburgtn/DSC08422_E0B45440-CFD6-42EB-B90B8DDD8F75824C_5daa5872-8054-42b6-90efa1e85a455bf0.jpg","https://www.gatlinburg.com/listing/moonshine-mountain-coaster/319/"],"37":["https://cdn2.smokymountains.com/uploads/2020/08/Pigeon-Forge-Rocky-Top-Mountain-Coaster-24.jpg","https://smokymountains.com/pigeon-forge/things-to-do/rocky-top-mountain-coaster"],"39":["https://cdn.tripster.com/media/product/gallery/original/SkyLand_Ranch___%2844197%29.jpeg","https://www.tripster.com/detail/skyland-ranch-sevierville"],"41":["https://dpstampede.com/hs-fs/hubfs/Imported_Blog_Media/original-Jan-13-2026-07-42-54-5087-PM.webp?height=580&name=original-Jan-13-2026-07-42-54-5087-PM.webp&width=1000","https://dpstampede.com/blog/places-visit-pigeon-forge-dolly-parton-fan"],"42":["https://piratesvoyage.com/media/63fcd4e6dbca58e9d472e836/original.webp","https://piratesvoyage.com/blog/guide-planning-visit-pirates-voyage-dinner-show-pigeon-forge/"],"44":["https://comedybarn.com/media/64c297a177d1fe669abdb536/large.webp","https://comedybarn.com/blog/category/comedy-barn/"],"46":["https://assets.website-files.com/615c1cf649d3f89312c413a0/6285601bbc671d4da0aa9b7f_Cades-Code.jpg","https://www.chrisandsara.com/post/cades-cove-travel-guide"],"48":["https://www.romanticasheville.com/sites/default/files/images/basic_page/clingmans_dome_1.jpg","https://www.romanticasheville.com/clingmans_dome.htm"],"49":["https://i.pinimg.com/originals/c6/dc/4f/c6dc4f31cde750cd8e1d0a068110340b.jpg","https://www.pinterest.com/pin/roaring-fork-motor-nature-trail-an-easy-oneway-driving-loop-on-the-edge-of--106538347411978012/"],"51":["https://pub-a4572e6ecae942889eeac3241a2da909.r2.dev/listings/sugarlands-visitor-center-gatlinburg/5de840f868c6-3-full.webp","https://www.thesmokymountains.com/listing/sugarlands-visitor-center-gatlinburg"],"52":["https://www.alpinechaletrentals.com/media/6894dcb75c7c71c6cf7344c6/original.webp","https://www.alpinechaletrentals.com/blog/best-fall-scenic-drives-smoky-mountains/"],"56":["https://www.hearthsidecabinrentals.com/media/6a0ccae7c97998e09a241369/original.webp","https://www.hearthsidecabinrentals.com/blog/smoky-mountains/waterfalls-smoky-mountains-drive-to/"],"57":["https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/b1/24/b2/caption.jpg?h=400&s=1&w=700","https://www.tripadvisor.com/Attraction_Review-g60842-d1524235-Reviews-The_Village_Shops-Gatlinburg_Tennessee.html"],"59":["https://www.amazingviewscabinrentals.com/media/66b50995e0d8c5cef62a3e9a/xlarge.webp","https://www.amazingviewscabinrentals.com/events/"],"60":["https://images.contentstack.io/v3/assets/blt1b696824a455b27c/bltf3704c35bed30704/67f0998ae16762e36dfe172d/Sevierville_Gallery_Slide4.jpg","https://www.tanger.inc/our-properties/locations/sevierville"],"61":["https://www.pigeonforge.com/wp-content/uploads/christmas-place-4.jpg","https://www.pigeonforge.com/business/christmas-place/"],"63":["https://nocoutfitters.com/cdn/shop/files/NOC_Gatlinburg_Exterior.jpg?v=1744315807","https://nocoutfitters.com/pages/store-locator"],"65":["https://crockettsbreakfastcamp.com/wp-content/uploads/2021/09/Crocketts-ext5.jpg","https://crockettsbreakfastcamp.com/blog/interesting-facts-restaurant-gatlinburg-tn/"],"66":["https://www.mobilebrochure.com/smoky-mountains/wp-content/uploads/sites/1/2014/06/PP-Building.jpg","https://www.mobilebrochure.com/smoky-mountains/brochure/restaurants/lunch/pancake-pantry/"],"69":["https://www.auntbugs.com/media/673bb671bf33582ddc65fd0a/xlarge.webp","https://www.auntbugs.com/gatlinburg-cabins-blog/restaurants-in-pigeon-forge-locals-love/"],"71":["https://www.mobilebrochure.com/smoky-mountains/wp-content/uploads/sites/1/2018/01/peddler-steakhouse.jpg","https://www.mobilebrochure.com/smoky-mountains/mobile-explorer/2018/01/05/romantic-locations-smokies/"],"73":["https://pub-a4572e6ecae942889eeac3241a2da909.r2.dev/listings/mama-s-farmhouse-pigeon-forge/10f5f0da29dd-4-full.webp","https://www.thesmokymountains.com/listing/mama-s-farmhouse-pigeon-forge"],"74":["https://www.parksidecabinrentals.com/media/69fce514b6bdae0f103cccb2/original.webp","https://www.parksidecabinrentals.com/blog/top-coffee-shops-gatlinburg/"],"75":["https://www.thebearskinlodge.com/media/65df56124fed229734493485/xlarge.webp","https://www.thebearskinlodge.com/blog/candy-shops-gatlinburg-smoky-mountain-taffy/"],"76":["https://smokymountainholiday.icnd-cdn.com/userfiles/67A0E86Fthe-crazy-mason-7BDDAA38-6DF9-4A25-BF2747A4BEA49EA4.jpg","https://www.smokymountainholiday.com/blog/best-dessert-sweets-in-gatlinburg"],"80":["https://cdn2.smokymountains.com/uploads/2020/11/Gatlinburg-Glades-Soda-Fountain-11.jpg","https://smokymountains.com/gatlinburg/restaurants/glades-soda-fountain"],"84":["https://cdn.sanity.io/images/k8yfdmw9/gatlinburg/cbde48689109b78edf7d5cb34c4e3b1fef5166e8-1223x705.png?auto=format&h=720&q=70&rect=142%2C0%2C940%2C705&w=960","https://www.gatlinburgskypark.com/events/nye-lights-of-wonder"],"87":["https://www.attractionsofamerica.com/images/all_destinations/20200620142022_moonshine-tasting.jpg","https://www.attractionsofamerica.com/attractions/top-things-to-do-gatlinburg-tennessee.php"],"88":["https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/b3/bc/cb/caption.jpg?h=1400&s=1&w=1400","https://www.tripadvisor.com/Restaurant_Review-g60842-d2077859-Reviews-Dick_s_Last_Resort-Gatlinburg_Tennessee.html"]};
window.GATLINBURG_ACTIVITIES.forEach(activity => {
  const n=Number(activity.id.replace("default-",""));
  const image=PHOTO_BATCH_REST[n];
  if(image){activity.photo=image[0];activity.photoSource=image[1];}
});
