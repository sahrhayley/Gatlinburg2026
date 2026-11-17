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
