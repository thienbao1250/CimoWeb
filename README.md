# CimoWeb - Hệ Thống Kết Nối Phụ Huynh Với Nhà Trường

Trong thời đại chuyển đổi số đang lan tỏa sâu rộng trên mọi lĩnh vực, ngành giáo dục cũng không nằm ngoài xu thế đó. Việc ứng dụng công nghệ thông tin vào công tác quản lý, giảng dạy và đặc biệt là kết nối giữa nhà trường với phụ huynh ngày càng trở nên thiết yếu. Ở bậc tiểu học, nơi học sinh còn nhỏ tuổi và chưa có khả năng chủ động cập nhật thông tin học tập, phụ huynh đóng vai trò quan trọng trong việc đồng hành cùng con em. Do đó, một hệ thống hỗ trợ giao tiếp nhanh chóng, minh bạch giữa nhà trường và gia đình không chỉ là nhu cầu thực tế mà còn là một phần trong xu hướng đổi mới giáo dục hiện đại.

Xuất phát từ thực tiễn đó, nhóm chúng tôi đã triển khai đề tài **“Cimo – Hệ thống kết nối phụ huynh với nhà trường”**, nhằm xây dựng một nền tảng web hỗ trợ việc quản lý học sinh và tạo kênh liên lạc hiệu quả giữa giáo viên, phụ huynh và nhà trường. Hệ thống giúp phụ huynh dễ dàng theo dõi quá trình học tập, điểm danh, thời khóa biểu của con em mình, đồng thời trao đổi trực tiếp với giáo viên khi cần thiết.

Cimo được thiết kế với ba giao diện chính tương ứng cho ba vai trò: Quản trị viên, Giáo viên và Phụ huynh, đảm bảo tính trực quan, dễ sử dụng và thân thiện với thiết bị di động. Về mặt công nghệ, hệ thống sử dụng React (TypeScript) cho giao diện người dùng, Django cho phần backend và MySQL làm cơ sở dữ liệu, bảo đảm hiệu năng ổn định, có khả năng mở rộng và tích hợp linh hoạt các tính năng mới.

Báo cáo này trình bày đầy đủ quá trình phát triển hệ thống từ phân tích yêu cầu, thiết kế, lập trình, đến kiểm thử và đánh giá kết quả. Thông qua đề tài này, nhóm mong muốn góp phần đưa ra một giải pháp công nghệ hữu ích nhằm nâng cao hiệu quả quản lý giáo dục và tăng cường sự gắn kết giữa gia đình và nhà trường trong môi trường học đường hiện đại.

## 1.1 GIỚI THIỆU ĐỀ TÀI

Trong bối cảnh công nghệ thông tin ngày càng đóng vai trò quan trọng trong mọi lĩnh vực của đời sống, việc ứng dụng nền tảng số vào công tác quản lý và tương tác giáo dục đã trở thành một xu thế tất yếu. Đặc biệt, đối với bậc tiểu học – nơi học sinh còn phụ thuộc nhiều vào sự hướng dẫn của giáo viên và sự đồng hành từ phụ huynh – thì mối liên kết chặt chẽ giữa nhà trường và gia đình càng đóng vai trò then chốt trong việc nâng cao chất lượng giáo dục toàn diện.

Xuất phát từ nhu cầu thực tiễn đó, nhóm chúng tôi đã lựa chọn và triển khai đề tài: **“Cimo – Hệ thống kết nối phụ huynh với nhà trường”**. Đây là một hệ thống web có giao diện thân thiện, tối ưu cho các thiết bị di động, giúp phụ huynh dễ dàng theo dõi tình hình học tập và sinh hoạt của con em, đồng thời hỗ trợ giáo viên và nhà trường trong công tác quản lý lớp học một cách hiệu quả và linh hoạt. Cimo được thiết kế với 3 giao diện tách biệt tương ứng với 3 vai trò sử dụng:

- **Giao diện Admin**: Quản lý lớp học, tài khoản người dùng, vai trò, phụ huynh và bài viết blog.
- **Giao diện Giáo viên**: Điểm danh, chat với phụ huynh, duyệt đơn xin nghỉ, nhập điểm, xem thông tin học sinh và phụ huynh.
- **Giao diện Phụ huynh**: Xem điểm danh, kết quả học tập, thời khóa biểu, tạo đơn nghỉ học, trò chuyện với giáo viên và chatbot hỗ trợ.

Thông qua quá trình thực hiện đề tài, nhóm không chỉ có cơ hội vận dụng những kiến thức đã được học vào thực tiễn, mà còn từng bước tiếp cận quy trình phát triển phần mềm một cách bài bản và chuyên nghiệp. Hơn thế nữa, đề tài còn hướng tới việc xây dựng một giải pháp công nghệ mang tính ứng dụng cao, góp phần hỗ trợ hiệu quả cho công tác quản lý và kết nối trong môi trường giáo dục hiện đại, đặc biệt là ở cấp tiểu học – nơi sự phối hợp giữa nhà trường và gia đình đóng vai trò đặc biệt quan trọng trong sự phát triển của học sinh.

## 1.2 MỤC TIÊU ĐỒ ÁN

Mục tiêu của đồ án “Cimo – Hệ thống kết nối phụ huynh với nhà trường” không chỉ dừng lại ở việc xây dựng một ứng dụng web với các chức năng cơ bản, mà còn hướng đến việc phát triển một giải pháp công nghệ toàn diện, có khả năng ứng dụng thực tế trong môi trường giáo dục tiểu học. Đề tài được triển khai với định hướng kỹ thuật rõ ràng, chú trọng đến tính khả thi, khả năng vận hành ổn định trong thực tế cũng như khả năng mở rộng linh hoạt trong tương lai, nhằm đáp ứng tốt nhu cầu ngày càng cao trong công tác quản lý và kết nối giữa nhà trường và phụ huynh.

### 1.2.1 Mục tiêu tổng quát

Hệ thống Cimo được định hướng xây dựng như một nền tảng thông minh, thân thiện với người dùng, cho phép ba nhóm đối tượng chính gồm phụ huynh, giáo viên và ban quản trị nhà trường có thể tương tác, trao đổi thông tin và phối hợp hiệu quả trong công tác quản lý và giáo dục học sinh. Giao diện của hệ thống được thiết kế trực quan, dễ sử dụng, đáp ứng tốt nhu cầu truy cập thường xuyên từ các thiết bị di động và phù hợp với thói quen sử dụng công nghệ của người dùng phổ thông.

Bên cạnh yếu tố công nghệ, hệ thống còn hướng đến việc tăng cường sự kết nối giữa nhà trường và gia đình – một yếu tố quan trọng trong giáo dục tiểu học. Thông qua việc cập nhật nhanh chóng các thông tin như điểm danh, kết quả học tập, lịch học, đơn xin nghỉ hay trao đổi trực tiếp với giáo viên, phụ huynh có thể theo dõi sát sao quá trình học tập và sinh hoạt của con em mình. Điều này góp phần hình thành một mối quan hệ hợp tác chặt紧 chẽ giữa gia đình và nhà trường trong việc hỗ trợ học sinh phát triển một cách toàn diện, cả về học lực lẫn kỹ năng sống.

Ngoài ra, Cimo cũng hướng đến việc nâng cao khả năng tự động hóa trong công tác quản lý lớp học. Thay vì xử lý thủ công qua sổ sách truyền thống, giáo viên và cán bộ quản lý có thể thực hiện các nghiệp vụ như điểm danh, nhập điểm, duyệt đơn xin nghỉ, gửi thông báo... một cách nhanh chóng và có hệ thống. Việc số hóa và tự động hóa này không chỉ giúp tiết kiệm thời gian và công sức, mà còn giảm thiểu sai sót trong quá trình quản lý, từ đó nâng cao hiệu quả điều hành và chất lượng giáo dục.

### 1.2.2 Mục tiêu cụ thể

1. **Xây dựng 3 giao diện tách biệt và rõ ràng theo vai trò người dùng**:
   - **Admin**: Quản lý người dùng, phân quyền, lớp học, phụ huynh, và tin tức nội bộ (blog).
   - **Giáo viên**: Quản lý điểm danh, duyệt đơn nghỉ học, nhập điểm, và trao đổi với phụ huynh.
   - **Phụ huynh**: Theo dõi điểm danh, kết quả học tập, thời khóa biểu, gửi đơn xin nghỉ, và tương tác với giáo viên thông qua chatbot hoặc hệ thống chat.
2. **Thiết kế hệ thống kiến trúc chuẩn RESTful API**: 
   Hệ thống Cimo được xây dựng dựa trên kiến trúc RESTful API – một mô hình thiết kế hiện đại, phổ biến trong phát triển phần mềm web. Việc áp dụng RESTful không chỉ giúp tổ chức mã nguồn một cách rõ ràng, dễ quản lý mà còn đảm bảo khả năng mở rộng, bảo trì và tái sử dụng trong tương lai. Giao tiếp giữa frontend và backend diễn ra thông qua các endpoint có cấu trúc thống nhất, dễ hiểu và độc lập với giao diện người dùng, từ đó tạo điều kiện thuận lợi cho việc phát triển thêm ứng dụng di động hoặc tích hợp với các hệ thống khác trong tương lai. Đồng thời, mô hình RESTful còn góp phần nâng cao hiệu suất hệ thống nhờ cơ chế truy vấn tài nguyên rõ ràng, tối ưu băng thông và hỗ trợ dễ dàng việc kiểm thử cũng như triển khai.
3. **Ứng dụng công nghệ hiện đại và phổ biến**:
   - Giao diện người dùng được phát triển bằng **React** kết hợp **TypeScript**, mang lại trải nghiệm mượt mà, dễ bảo trì.
   - Backend sử dụng **Django** – framework mạnh mẽ và bảo mật cao trong lĩnh vực phát triển ứng dụng web.
   - Dữ liệu được lưu trữ bằng **MySQL**, dễ dàng quản lý, truy vấn và mở rộng quy mô.
4. **Tối ưu hóa hiệu năng hệ thống**:
   Hệ thống Cimo được thiết kế với mục tiêu tối ưu hóa hiệu năng nhằm đảm bảo khả năng hoạt động ổn định trên các thiết bị phổ thông, đặc biệt là điện thoại di động. Trong thực tế, phần lớn phụ huynh và giáo viên sẽ truy cập hệ thống qua smartphone, do đó giao diện cần được thiết kế nhẹ, tốc độ phản hồi nhanh và tương thích tốt với các độ phân giải màn hình khác nhau. Việc tối ưu hóa này không chỉ cải thiện trải nghiệm người dùng mà còn giúp hệ thống vận hành mượt mà trong điều kiện hạ tầng không quá mạnh.
5. **Thực hiện triển khai hệ thống trên môi trường production**:
   Hệ thống không chỉ dừng lại ở mức mô phỏng trong môi trường phát triển, mà đã được triển khai thực tế trên môi trường production nhằm đảm bảo người dùng có thể truy cập, trải nghiệm và sử dụng hệ thống một cách đầy đủ. Điều này giúp nhóm tiếp cận sát hơn với quy trình triển khai phần mềm ngoài thực tế, đồng thời phát hiện và xử lý kịp thời các vấn đề phát sinh liên quan đến bảo mật, hiệu năng, và khả năng mở rộng của hệ thống.
6. **Tăng cường khả năng làm việc nhóm, quản lý tiến độ và tích hợp công cụ hiện đại**:
   Trong suốt quá trình phát triển hệ thống, nhóm đã chú trọng rèn luyện kỹ năng làm việc nhóm và quản lý tiến độ thông qua việc sử dụng các công cụ hỗ trợ chuyên nghiệp. **GitLab** được dùng để quản lý mã nguồn, theo dõi lịch sử thay đổi và kiểm soát phiên bản; **Trello** được sử dụng để phân chia nhiệm vụ, theo dõi tiến độ thực hiện và phối hợp giữa các thành viên. Việc áp dụng các công cụ này không chỉ giúp quy trình phát triển phần mềm trở nên rõ ràng và hiệu quả hơn mà còn tạo tiền đề cho nhóm làm quen với môi trường làm việc thực tế trong ngành công nghệ thông tin.
7. **Đảm bảo bảo mật và phân quyền rõ ràng**:
   Đảm bảo bảo mật và phân quyền rõ ràng là một yếu tố then chốt trong việc xây dựng hệ thống Cimo, đặc biệt khi hệ thống phục vụ nhiều nhóm người dùng khác nhau như phụ huynh, giáo viên và quản trị viên. Việc phân quyền hợp lý giúp ngăn chặn tình trạng người dùng truy cập vào những thông tin không phù hợp với vai trò của mình, từ đó hạn chế nguy cơ rò rỉ dữ liệu và đảm bảo tính riêng tư trong môi trường giáo dục. Cụ thể, phụ huynh chỉ được phép xem thông tin liên quan đến con em mình như điểm danh, kết quả học tập và thời khóa biểu; giáo viên có thể thao tác với học sinh trong lớp mình phụ trách như điểm danh, nhập điểm, duyệt đơn xin nghỉ và nhắn tin với phụ huynh; trong khi đó, quản trị viên có quyền cao nhất trong việc quản lý tài khoản, lớp học, phân vai trò và nội dung hệ thống. Bên cạnh đó, hệ thống còn áp dụng các cơ chế bảo mật như xác thực tài khoản, kiểm tra quyền truy cập và mã hóa thông tin nhạy cảm, nhằm đảm bảo dữ liệu luôn được bảo vệ an toàn trong suốt quá trình sử dụng. Những biện pháp này không chỉ giúp hệ thống hoạt động hiệu quả, mà còn góp phần xây dựng một môi trường kết nối tin cậy và chuyên nghiệp giữa nhà trường và phụ huynh.

### 1.2.3 Mục tiêu giáo dục

- Giúp các thành viên trong nhóm hiểu rõ hơn quy trình phát triển một phần mềm hoàn chỉnh: từ khảo sát yêu cầu, thiết kế hệ thống, xây dựng database, viết API, giao diện người dùng đến kiểm thử và triển khai.
- Rèn luyện kỹ năng tự học, tự nghiên cứu tài liệu công nghệ mới, kỹ năng phối hợp và giải quyết vấn đề trong môi trường làm việc nhóm.
- Làm nền tảng kiến thức và thực hành tốt cho các môn học tiếp theo, hoặc cho định hướng nghề nghiệp tương lai trong lĩnh vực lập trình web hoặc phát triển sản phẩm.

## 1.3 MỤC TIÊU QUẢNG BÁ

Sau khi hoàn thiện hệ thống, nhóm đặt mục tiêu không chỉ dừng lại ở một bài tập học thuật mà sẽ phát triển Cimo như một sản phẩm có tiềm năng ứng dụng thực tế. Cụ thể:

- **Giới thiệu tại các buổi demo trong trường học**: nhằm thu hút sự quan tâm từ giảng viên, sinh viên, phụ huynh và cán bộ quản lý giáo dục.
- **Ghi nhận phản hồi thực tế từ người dùng thử**: để cải thiện tính năng, trải nghiệm người dùng, và khả năng đáp ứng nhu cầu.
- **Xây dựng bộ tài liệu và video giới thiệu hệ thống**: hỗ trợ trình bày sản phẩm với nhà trường, nhà đầu tư hoặc các bên liên quan.
- **Tiến tới triển khai thử nghiệm trong môi trường thực tế**: tại một hoặc vài trường tiểu học nếu có cơ hội.
- **Phát triển kênh truyền thông riêng**: như fanpage Facebook hoặc website landing page để quảng bá hệ thống Cimo đến cộng đồng giáo dục.
