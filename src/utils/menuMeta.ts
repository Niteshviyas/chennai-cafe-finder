// Auto-generates descriptions and image URLs for menu items based on their name
// This avoids modifying the large cafes.ts data file

interface ItemMeta {
  description: string;
  image: string;
}

interface MetaRule {
  keywords: string[];
  descriptions: string[];
  images: string[];
}

const META_RULES: MetaRule[] = [
  {
    keywords: ["espresso"],
    descriptions: ["Rich, bold shot of pure coffee intensity", "Classic Italian espresso with a golden crema"],
    images: ["photo-1510707577719-ae7c14805e3a?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["latte"],
    descriptions: ["Smooth espresso blended with velvety steamed milk", "Creamy café latte with silky foam art"],
    images: ["photo-1570968915860-54d5c301fa9f?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["cappuccino"],
    descriptions: ["Perfectly balanced espresso, steamed milk & foam", "Classic cappuccino with rich, frothy top"],
    images: ["photo-1572442388796-11668a67e53d?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["cold brew"],
    descriptions: ["Slow-steeped for 18 hours, smooth & refreshing", "Bold cold-brewed coffee served over ice"],
    images: ["photo-1461023058943-07fcbe16d735?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["filter coffee"],
    descriptions: ["Traditional South Indian filter coffee, bold & aromatic", "Authentic decoction-brewed filter kaapi"],
    images: ["photo-1497636577773-f1231844b336?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["mocha"],
    descriptions: ["Espresso meets rich chocolate & steamed milk", "Indulgent chocolate-infused coffee drink"],
    images: ["photo-1578314675249-a6910f80cc4e?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["americano"],
    descriptions: ["Espresso diluted with hot water for a clean taste", "Bold & smooth, the classic black coffee"],
    images: ["photo-1521302080334-4bebac2763a6?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["macchiato"],
    descriptions: ["Espresso stained with a dash of foamed milk", "Bold espresso with a hint of creamy sweetness"],
    images: ["photo-1485808191679-5f86510681a2?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["affogato"],
    descriptions: ["Hot espresso poured over creamy gelato", "The perfect marriage of coffee & ice cream"],
    images: ["photo-1579954115545-a95591f28bfc?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["chai", "tea"],
    descriptions: ["Aromatic spiced tea brewed to perfection", "Warming blend of tea leaves & Indian spices"],
    images: ["photo-1556679343-c7306c1976bc?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["matcha"],
    descriptions: ["Premium Japanese green tea, whisked to perfection", "Vibrant matcha with a smooth, earthy flavor"],
    images: ["photo-1515823064-d6e0c04616a7?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["kombucha"],
    descriptions: ["Fermented tea with natural probiotics & fizz", "Refreshing probiotic drink with tangy notes"],
    images: ["photo-1563227812-0ea4c22e6cc8?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["smoothie"],
    descriptions: ["Fresh fruits blended into a creamy, thick shake", "Nutrient-packed smoothie bursting with flavor"],
    images: ["photo-1505252585461-04db1eb84625?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["milkshake", "shake"],
    descriptions: ["Thick, creamy milkshake blended to perfection", "Indulgent shake topped with whipped cream"],
    images: ["photo-1572490122747-3968b75cc699?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["juice"],
    descriptions: ["Freshly squeezed, pure & naturally sweet", "Cold-pressed juice packed with vitamins"],
    images: ["photo-1534353473418-4cfa6c56fd38?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["lemonade"],
    descriptions: ["Zingy fresh lemonade with a hint of mint", "Classic refresher made with real lemons"],
    images: ["photo-1621263764928-df1444c5e859?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["mojito"],
    descriptions: ["Muddled mint & lime with sparkling soda", "Refreshing mocktail with zesty citrus notes"],
    images: ["photo-1551538827-9c037cb4f32a?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["frappe"],
    descriptions: ["Icy blended coffee with creamy sweetness", "Frozen coffee treat, perfect for hot days"],
    images: ["photo-1461023058943-07fcbe16d735?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["hot chocolate"],
    descriptions: ["Rich, velvety cocoa topped with marshmallows", "Warm chocolate bliss in every sip"],
    images: ["photo-1542990253-0d0f5be5f0ed?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["lassi"],
    descriptions: ["Traditional Indian yogurt drink, cool & creamy", "Thick lassi blended with fresh curd"],
    images: ["photo-1626082927389-6cd097cdc6ec?w=120&h=120&fit=crop"],
  },
  // Desserts
  {
    keywords: ["brownie"],
    descriptions: ["Dense, fudgy chocolate brownie, warm & gooey", "Rich dark chocolate brownie with a crisp top"],
    images: ["photo-1606313564200-e75d5e30476c?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["cake"],
    descriptions: ["Moist, layered cake baked fresh daily", "Fluffy cake with rich frosting & love"],
    images: ["photo-1578985545062-69928b1d9587?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["cheesecake"],
    descriptions: ["Creamy New York-style cheesecake on a biscuit base", "Silky smooth cheesecake, utterly indulgent"],
    images: ["photo-1524351199678-941a58a3df50?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["tiramisu"],
    descriptions: ["Italian classic with mascarpone & coffee-soaked layers", "Pillowy tiramisu dusted with cocoa"],
    images: ["photo-1571877227200-a0d98ea607e9?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["cookie"],
    descriptions: ["Freshly baked, crispy outside, chewy inside", "Warm cookie loaded with chocolate chips"],
    images: ["photo-1499636136210-6f4ee915583e?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["waffle"],
    descriptions: ["Golden Belgian waffle with your choice of toppings", "Crispy waffle drizzled with maple & cream"],
    images: ["photo-1562376552-0d160a2f238d?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["pancake"],
    descriptions: ["Fluffy stack of buttermilk pancakes", "Soft pancakes with butter & syrup"],
    images: ["photo-1567620905732-2d1ec7ab7445?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["croissant"],
    descriptions: ["Buttery, flaky French croissant baked golden", "Perfectly laminated croissant, light & airy"],
    images: ["photo-1555507036-ab1f4038024a?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["muffin"],
    descriptions: ["Freshly baked muffin, soft & flavorful", "Tender muffin with a golden domed top"],
    images: ["photo-1607958996333-41aef7caefaa?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["scone"],
    descriptions: ["Crumbly English scone with clotted cream", "Buttery scone, perfect with jam & tea"],
    images: ["photo-1583743089695-4b816a340f82?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["donut", "doughnut"],
    descriptions: ["Soft glazed donut, fresh from the fryer", "Ring of sweet dough topped with glaze"],
    images: ["photo-1551024601-bec78aea704b?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["ice cream", "gelato", "sundae"],
    descriptions: ["Creamy artisanal ice cream, handcrafted daily", "Smooth scoops of premium frozen delight"],
    images: ["photo-1497034825429-c343d7c6a68f?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["pudding"],
    descriptions: ["Silky, creamy pudding with a caramel finish", "Comfort dessert, smooth & delightful"],
    images: ["photo-1551024506-0bccd828d307?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["churros"],
    descriptions: ["Crispy fried dough sticks with chocolate dip", "Golden churros coated in cinnamon sugar"],
    images: ["photo-1624371414361-e670246ae8ec?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["mousse"],
    descriptions: ["Light, airy chocolate mousse in a glass", "Cloud-like mousse with intense cocoa flavor"],
    images: ["photo-1541783245831-57d6fb0926d3?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["macarons"],
    descriptions: ["Delicate French macarons in assorted flavors", "Crisp shells with smooth ganache filling"],
    images: ["photo-1569864358642-9d1684040f43?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["crepe"],
    descriptions: ["Thin French crêpe with sweet fillings", "Delicate crêpe folded with Nutella & berries"],
    images: ["photo-1519676867240-f03562e64548?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["cinnamon roll"],
    descriptions: ["Warm swirl of cinnamon with cream cheese glaze", "Freshly baked roll, gooey & aromatic"],
    images: ["photo-1509365390695-33aee754301f?w=120&h=120&fit=crop"],
  },
  // Snacks
  {
    keywords: ["sandwich"],
    descriptions: ["Layered sandwich with fresh, quality ingredients", "Toasted to perfection with savory fillings"],
    images: ["photo-1528735602780-2552fd46c7af?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["toast", "avocado"],
    descriptions: ["Crunchy artisan toast with premium toppings", "Golden toast loaded with fresh ingredients"],
    images: ["photo-1541519227354-08fa5d50c44d?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["fries"],
    descriptions: ["Crispy golden fries, seasoned just right", "Hand-cut fries served piping hot"],
    images: ["photo-1573080496219-bb080dd4f877?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["nachos"],
    descriptions: ["Crunchy tortilla chips loaded with cheese & salsa", "Loaded nachos with all the fixings"],
    images: ["photo-1513456852971-30c0b8199d4d?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["bruschetta"],
    descriptions: ["Toasted bread topped with fresh tomato & basil", "Italian-style bruschetta, bright & flavorful"],
    images: ["photo-1572695157366-5e585ab2b69f?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["spring roll"],
    descriptions: ["Crispy rolls stuffed with veggies & herbs", "Light, crunchy spring rolls with dipping sauce"],
    images: ["photo-1548507200-c54884c4a68e?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["hummus", "pita"],
    descriptions: ["Creamy chickpea hummus with warm pita bread", "Smooth hummus drizzled with olive oil"],
    images: ["photo-1577805947697-89e18249d767?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["garlic bread"],
    descriptions: ["Warm, buttery garlic bread, golden & crispy", "Toasted bread rubbed with garlic & herbs"],
    images: ["photo-1619535860434-ba1d8fa12536?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["wrap"],
    descriptions: ["Soft tortilla wrap packed with fresh fillings", "Hearty wrap bursting with flavor"],
    images: ["photo-1626700051175-6818013e1d4f?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["quesadilla"],
    descriptions: ["Cheesy quesadilla, grilled until golden", "Melty cheese folded in a crispy tortilla"],
    images: ["photo-1618040996337-56904b7850b9?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["samosa"],
    descriptions: ["Crispy pastry filled with spiced potatoes", "Golden fried samosa with tangy chutney"],
    images: ["photo-1601050690597-df0568f70950?w=120&h=120&fit=crop"],
  },
  // Meals
  {
    keywords: ["burger"],
    descriptions: ["Juicy patty stacked with fresh toppings", "Gourmet burger with handcrafted bun"],
    images: ["photo-1568901346375-23c9450c58cd?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["pizza"],
    descriptions: ["Wood-fired pizza with artisan toppings", "Thin crust pizza, blistered & bubbling"],
    images: ["photo-1565299624946-b28f40a0ae38?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["pasta"],
    descriptions: ["Al dente pasta tossed in rich, savory sauce", "Comforting bowl of hand-crafted pasta"],
    images: ["photo-1621996346565-e3dbc646d9a9?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["biryani"],
    descriptions: ["Fragrant, layered rice with aromatic spices", "Dum-cooked biryani, rich & flavorful"],
    images: ["photo-1563379091339-03b21ab4a4f8?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["salad"],
    descriptions: ["Fresh greens tossed with seasonal vegetables", "Crisp, colorful salad with zesty dressing"],
    images: ["photo-1512621776951-a57141f2eefd?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["bowl"],
    descriptions: ["Wholesome bowl packed with balanced goodness", "Nourishing bowl with grains, veggies & protein"],
    images: ["photo-1546069901-ba9599a7e63c?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["soup"],
    descriptions: ["Warm, comforting soup made from scratch", "Hearty soup simmered with fresh ingredients"],
    images: ["photo-1547592166-23ac45744acd?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["paneer"],
    descriptions: ["Soft cottage cheese in a flavorful preparation", "Rich paneer dish with aromatic gravy"],
    images: ["photo-1631452180519-c014fe946bc7?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["chicken"],
    descriptions: ["Tender chicken cooked with bold spices", "Succulent chicken, perfectly seasoned"],
    images: ["photo-1598515214211-89d3c73ae83b?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["egg", "omelette", "benedict"],
    descriptions: ["Farm-fresh eggs prepared your way", "Perfectly cooked eggs, fluffy & golden"],
    images: ["photo-1525351484163-7529414344d8?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["risotto"],
    descriptions: ["Creamy Italian risotto, slow-stirred to perfection", "Rich, velvety risotto with parmesan"],
    images: ["photo-1633964913295-ceb43826e7c1?w=120&h=120&fit=crop"],
  },
  {
    keywords: ["noodle"],
    descriptions: ["Stir-fried noodles tossed with fresh veggies", "Savory noodles with an Asian-inspired twist"],
    images: ["photo-1569718212165-3a8278d5f624?w=120&h=120&fit=crop"],
  },
];

// Fallback descriptions and images by category
const FALLBACK: Record<string, { descriptions: string[]; images: string[] }> = {
  "Coffee & Tea": {
    descriptions: ["Carefully crafted with premium beans", "A warm cup of café excellence"],
    images: ["photo-1495474472287-4d71bcdd2085?w=120&h=120&fit=crop"],
  },
  Beverages: {
    descriptions: ["Refreshing drink made with fresh ingredients", "Cool & delicious, served chilled"],
    images: ["photo-1544145945-f90425340c7e?w=120&h=120&fit=crop"],
  },
  Desserts: {
    descriptions: ["Sweet treat crafted with love & care", "Indulgent dessert to satisfy your cravings"],
    images: ["photo-1488477181946-6428a0291777?w=120&h=120&fit=crop"],
  },
  Snacks: {
    descriptions: ["Light bite with bold, satisfying flavors", "Perfect snack for any time of day"],
    images: ["photo-1504674900247-0877df9cc836?w=120&h=120&fit=crop"],
  },
  Meals: {
    descriptions: ["Wholesome meal prepared with fresh ingredients", "Satisfying dish that hits every note"],
    images: ["photo-1546069901-ba9599a7e63c?w=120&h=120&fit=crop"],
  },
  Specials: {
    descriptions: ["Chef's special, unique & delightful", "A house favorite you won't want to miss"],
    images: ["photo-1504674900247-0877df9cc836?w=120&h=120&fit=crop"],
  },
};

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getItemMeta(itemName: string, category: string): ItemMeta {
  const nameLower = itemName.toLowerCase();
  const hash = hashString(itemName);

  // Try to match specific rules
  for (const rule of META_RULES) {
    if (rule.keywords.some((kw) => nameLower.includes(kw))) {
      return {
        description: rule.descriptions[hash % rule.descriptions.length],
        image: `https://images.unsplash.com/${rule.images[hash % rule.images.length]}`,
      };
    }
  }

  // Fallback by category
  const fb = FALLBACK[category] || FALLBACK["Specials"];
  return {
    description: fb.descriptions[hash % fb.descriptions.length],
    image: `https://images.unsplash.com/${fb.images[hash % fb.images.length]}`,
  };
}
