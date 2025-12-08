import SectionWrapper from "./SectionWrapper";

export default function HowItWorks() {
  const steps = [
    { 
      number: "1", 
      color: "text-blue-600", 
      title: "Giáo viên cấp mã PIN", 
      desc: "Mỗi phụ huynh sẽ được giáo viên cung cấp một mã PIN riêng để truy cập hệ thống." 
    },
    { 
      number: "2", 
      color: "text-green-600", 
      title: "Đăng nhập bằng số điện thoại", 
      desc: "Sử dụng số điện thoại đã khai báo với giáo viên cùng mã PIN được cấp để đăng nhập." 
    },
    { 
      number: "3", 
      color: "text-orange-600", 
      title: "Theo dõi kết quả học tập", 
      desc: "Phụ huynh có thể xem điểm số, báo cáo và toàn bộ hoạt động học tập của học sinh." 
    },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-600 to-green-600 py-16">
      <SectionWrapper>
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-white mb-4">Cách sử dụng đơn giản</h3>
          <p className="text-blue-100 text-lg">Hoàn thành trong 3 bước nhanh chóng</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className={`text-2xl font-bold ${step.color}`}>{step.number}</span>
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">{step.title}</h4>
              <p className="text-blue-100">{step.desc}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>
    </div>
  );
}
