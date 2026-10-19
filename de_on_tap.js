let bookings = [
  {
    bookingCode: "CIN-001",
    customerName: "Nguyễn Văn An",
    movieTitle: "Ánh Trăng Cuối Phố",
    ticketCount: 2,
    pricePerTicket: 90000,
    totalAmount: 194400
  },
  {
    bookingCode: "CIN-002",
    customerName: "Trần Thị Bình",
    movieTitle: "Biệt Đội Sao Băng",
    ticketCount: 4,
    pricePerTicket: 90000,
    totalAmount: 349920
  },
  {
    bookingCode: "CIN-003",
    customerName: "Lê Minh Châu",
    movieTitle: "Mùa Hè Rực Lửa",
    ticketCount: 6,
    pricePerTicket: 110000,
    totalAmount: 641520
  }
];

function main() {
  let isRunning = true;

  do {
    console.log("=====================================================");
    console.log("     HỆ THỐNG QUẢN LÝ ĐẶT VÉ MOONLIGHT CINEMA");
    console.log("=====================================================");
    console.log("1. Hiển thị danh sách đơn đặt vé");
    console.log("2. Thêm đơn đặt vé mới");
    console.log("3. Cập nhật đơn đặt vé");
    console.log("4. Xóa đơn đặt vé");
    console.log("5. Tìm kiếm đơn đặt vé theo tên phim");
    console.log("0. Thoát chương trình");
    console.log("=====================================================");

    let choice = prompt("Vui lòng nhập lựa chọn của bạn (0 - 5):");

    if (choice === null) {
      console.log("Lựa chọn không hợp lệ.");
      continue;
    }

    choice = choice.trim();

    switch (choice) {
      case "1":
        displayBookings(bookings);
        break;
      case "2":
        addBooking();
        break;
      case "3":
        updateBooking();
        break;
      case "4":
        deleteBooking();
        break;
      case "5":
        searchBooking();
        break;
      case "0":
        showReport();
        console.log("Chào tạm biệt!");
        isRunning = false;
        break;
      default:
        console.log("Lựa chọn ngoài 0 - 5. Vui lòng thử lại.");
    }
  } while (isRunning);
}

function formatMoney(amount) {
  return amount.toLocaleString("vi-VN") + " VNĐ";
}

function formatText(text) {
  let words = text.trim().split(/\s+/);
  for (let i = 0; i < words.length; i++) {
    let firstChar = words[i][0].toUpperCase();
    let restChar = words[i].slice(1).toLowerCase();
    words[i] = firstChar + restChar;
  }
  return words.join(" ");
}

function findBookingIndex(code) {
  for (let i = 0; i < bookings.length; i++) {
    if (bookings[i].bookingCode === code) {
      return i;
    }
  }
  return -1;
}

function validateBookingCode(code) {
  if (code === "") {
    return "Chưa nhập mã đặt vé";
  }
  if (code.length < 6) {
    return "Độ dài nhỏ hơn 6 ký tự";
  }
  if (!code.startsWith("CIN-")) {
    return "Sai tiền tố CIN-";
  }
  if (code.includes(" ")) {
    return "Chứa khoảng trắng";
  }
  let index = findBookingIndex(code);
  if (index !== -1) {
    return "Mã đặt vé đã tồn tại";
  }
  return "";
}

function inputPositiveInteger(message) {
  while (true) {
    let input = prompt(message);
    if (input === null) {
      return null;
    }
    input = input.trim();
    let num = Number(input);
    if (Number.isInteger(num) && num > 0) {
      return num;
    }
  }
}

function calculateTotal(ticketCount, pricePerTicket) {
  let baseCost = ticketCount * pricePerTicket;
  let discount = 0;
  
  if (ticketCount >= 4) {
    discount = Math.round(baseCost * 0.1);
  }
  
  let serviceFee = Math.round((baseCost - discount) * 0.08);
  let totalAmount = baseCost - discount + serviceFee;

  return {
    baseCost: baseCost,
    discount: discount,
    serviceFee: serviceFee,
    totalAmount: totalAmount
  };
}

function displayBookings(list) {
  if (list.length === 0) {
    console.log("Danh sách đơn đặt vé trống");
    return;
  }

  let totalRev = 0;
  for (let i = 0; i < list.length; i++) {
    let b = list[i];
    console.log(`${i + 1}. ${b.bookingCode} - ${b.customerName} - ${b.movieTitle}`);
    console.log(`   SL: ${b.ticketCount} | Giá: ${b.pricePerTicket} | Tổng TT: ${formatMoney(b.totalAmount)}`);
    totalRev = totalRev + b.totalAmount;
  }
  
  console.log(`Tổng: ${list.length} đơn đặt vé – Doanh thu: ${formatMoney(totalRev)}`);
}

function addBooking() {
  let codeInput = prompt("Nhập mã đặt vé:");
  if (codeInput === null) {
    return;
  }
  
  let code = codeInput.trim().toUpperCase();
  let errorMsg = validateBookingCode(code);
  
  if (errorMsg !== "") {
    console.log("Lỗi: " + errorMsg);
    return;
  }

  let nameInput = "";
  while (true) {
    nameInput = prompt("Nhập tên khách hàng:");
    if (nameInput === null) {
      return;
    }
    nameInput = nameInput.trim();
    if (nameInput !== "") {
      break;
    }
  }
  let customerName = formatText(nameInput);

  let movieInput = "";
  while (true) {
    movieInput = prompt("Nhập tên phim:");
    if (movieInput === null) {
      return;
    }
    movieInput = movieInput.trim();
    if (movieInput !== "") {
      break;
    }
  }
  let movieTitle = formatText(movieInput);

  let qty = inputPositiveInteger("Nhập số vé:");
  if (qty === null) {
    return;
  }

  let price = inputPositiveInteger("Nhập giá mỗi vé:");
  if (price === null) {
    return;
  }

  let moneyData = calculateTotal(qty, price);

  let newBooking = {
    bookingCode: code,
    customerName: customerName,
    movieTitle: movieTitle,
    ticketCount: qty,
    pricePerTicket: price,
    totalAmount: moneyData.totalAmount
  };

  bookings.push(newBooking);

  console.log("Thêm thành công!");
  console.log(`Mã: ${code} | Khách: ${customerName} | Phim: ${movieTitle}`);
  console.log(`SL: ${qty} | Giá: ${price}`);
  console.log(`Chi phí CS: ${moneyData.baseCost} | Giảm giá: ${moneyData.discount} | Phụ phí: ${moneyData.serviceFee}`);
  console.log(`Tổng TT: ${formatMoney(moneyData.totalAmount)}`);
}

function updateBooking() {
  let codeInput = prompt("Nhập mã đặt vé cần cập nhật:");
  if (codeInput === null) {
    return;
  }
  
  let code = codeInput.trim().toUpperCase();
  let index = findBookingIndex(code);

  if (index === -1) {
    console.log(`Không tìm thấy đơn đặt vé có mã ${code}`);
    return;
  }

  let oldTotal = bookings[index].totalAmount;

  let newQty = inputPositiveInteger("Nhập số vé mới:");
  if (newQty === null) {
    console.log("Đã hủy cập nhật");
    return;
  }

  let newPrice = inputPositiveInteger("Nhập giá vé mới:");
  if (newPrice === null) {
    console.log("Đã hủy cập nhật");
    return;
  }

  let moneyData = calculateTotal(newQty, newPrice);
  
  bookings[index].ticketCount = newQty;
  bookings[index].pricePerTicket = newPrice;
  bookings[index].totalAmount = moneyData.totalAmount;

  console.log("Cập nhật thành công");
  console.log(`Tổng TT cũ: ${formatMoney(oldTotal)} | Tổng TT mới: ${formatMoney(moneyData.totalAmount)}`);
}

function deleteBooking() {
  let codeInput = prompt("Nhập mã đặt vé cần xóa:");
  if (codeInput === null) {
    console.log("Đã hủy thao tác xóa");
    return;
  }
  
  let code = codeInput.trim().toUpperCase();
  let index = findBookingIndex(code);

  if (index === -1) {
    console.log(`Không tìm thấy đơn đặt vé có mã ${code}`);
    return;
  }

  let confirmAction = prompt("Bạn có chắc muốn xóa? (Y/N):");
  if (confirmAction === null) {
    console.log(`Đã hủy thao tác xóa, còn ${bookings.length} đơn`);
    return;
  }

  confirmAction = confirmAction.trim().toLowerCase();
  
  if (confirmAction === "y") {
    bookings.splice(index, 1);
    console.log(`Xóa thành công, còn ${bookings.length} đơn`);
  } else {
    console.log(`Đã hủy thao tác xóa, còn ${bookings.length} đơn`);
  }
}

function searchBooking() {
  let keyword = prompt("Nhập từ khóa tìm kiếm phim:");
  if (keyword === null) {
    console.log("Chưa nhập từ khóa tìm kiếm");
    return;
  }

  keyword = keyword.trim().toLowerCase();
  if (keyword === "") {
    console.log("Chưa nhập từ khóa tìm kiếm");
    return;
  }

  let resultList = [];
  for (let i = 0; i < bookings.length; i++) {
    let titleLower = bookings[i].movieTitle.toLowerCase();
    if (titleLower.includes(keyword)) {
      resultList.push(bookings[i]);
    }
  }

  if (resultList.length === 0) {
    console.log("Không tìm thấy đơn đặt vé phù hợp");
  } else {
    displayBookings(resultList);
  }
}

function showReport() {
  console.log("==================================================");
  console.log("BÁO CÁO TỔNG KẾT ĐƠN ĐẶT VÉ");
  console.log("==================================================");
  
  if (bookings.length === 0) {
    console.log("Chưa có đơn đặt vé nào");
    console.log("==================================================");
    return;
  }

  let totalRev = 0;
  let maxBooking = bookings[0];

  for (let i = 0; i < bookings.length; i++) {
    totalRev = totalRev + bookings[i].totalAmount;
    if (bookings[i].totalAmount > maxBooking.totalAmount) {
      maxBooking = bookings[i];
    }
  }

  let avgRev = Math.round(totalRev / bookings.length);

  console.log(`Tổng số đơn đặt vé: ${bookings.length}`);
  console.log(`Tổng doanh thu: ${formatMoney(totalRev)}`);
  console.log(`Doanh thu trung bình: ${formatMoney(avgRev)}`);
  console.log(`Đơn cao nhất: ${maxBooking.bookingCode} - ${formatMoney(maxBooking.totalAmount)}`);
  console.log("==================================================");
}

main();