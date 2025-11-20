const Stock = require('../models/stock.js');



exports.getAllStocks = async (req, res) => {
  try {
    console.log(" [Controller] getAllStocks() called");

    const stocks = await Stock.findAll();
    console.log(" Found stocks:", stocks.length);

    res.json({
      success: true,
      data: stocks
    });

  } catch (error) {
    console.error(" Error in getAllStocks:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.getStockById = async (req, res) => {
  try {
    const { id } = req.params;
    const stock = await Stock.findByPk(id);
    if (!stock) return res.status(404).json({ error: 'Stock not found' });
    res.json(stock);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.createStock = async (req, res) => {
  try {
    

    const { name, color, size, stock, price, notes } = req.body;

    // เช็คข้อมูลเบื้องต้น
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "name and price are required."
      });
    }

    const newStock = await Stock.create({
      name,
      color,
      size,
      stock: stock || 0,
      price,
      notes
    });

    console.log("✅ Stock created:", newStock.stock_id);

    res.json({
      success: true,
      data: newStock
    });

  } catch (error) {
    console.error(" Error in createStock:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
  
};



exports.deleteStock = async (req, res) => {
  try {
   

    const { id } = req.params;
    console.log(id)
    console.log(" Request to delete stock ID:", id);

    const deleted = await Stock.destroy({ where: { stock_id: id } });

    if (deleted === 0) {
      console.log(" No stock found for ID:", id);
      return res.status(404).json({
        success: false,
        message: "Stock not found"
      });
    }

    console.log(" Deleted stock ID complete:", id);

    res.json({
      success: true,
      message: `Stock ID ${id} deleted successfully`
    });

  } catch (error) {
    console.error(" Error in deleteStock:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};



exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Stock.update(req.body, {
      where: { stock_id: id }
    });

    if (updated[0] === 0) {
      return res.status(404).json({ message: "Stock not found" });
    }

    res.json({
      message: "Stock updated successfully",
      data: req.body
    });

  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
