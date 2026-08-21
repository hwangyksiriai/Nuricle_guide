/**
 * NURICLE 캠페인 신청 폼 → 구글시트 연동
 *
 * 사용법:
 * 1) 이 스프레드시트에서 확장 프로그램 > Apps Script 를 연다.
 * 2) 기본으로 생긴 Code.gs 내용을 지우고 이 파일 내용을 통째로 붙여넣는다.
 * 3) 저장 후 배포 > 새 배포 > 유형: 웹 앱
 *    - 실행할 계정: 나
 *    - 액세스 권한이 있는 사용자: 전체
 * 4) 배포 후 발급되는 웹 앱 URL(.../exec)을 복사해서 전달한다.
 *    (index.html 등 각 페이지의 GAS_WEB_APP_URL에 채워 넣을 값)
 *
 * 고료 등급(A~F)별로 시트 탭을 자동 생성해서 각 탭에 신청 데이터를 쌓는다.
 */

var HEADER = ['제출시각', '등급', '고료', '이름', '인스타그램', '휴대폰', '이메일', '우편번호', '주소', '요청사항'];

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var tabName = data.tier || '기타';
  var sheet = ss.getSheetByName(tabName);

  if (!sheet) {
    sheet = ss.insertSheet(tabName);
    sheet.appendRow(HEADER);
    sheet.getRange(1, 1, 1, HEADER.length).setFontWeight('bold');
  }

  sheet.appendRow([
    new Date(),
    data.tier || '',
    data.price || '',
    data.name || '',
    data.instagram || '',
    data.phone ? "'" + data.phone : '',
    data.email || '',
    data.zipcode ? "'" + data.zipcode : '',
    data.address || '',
    data.note || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
