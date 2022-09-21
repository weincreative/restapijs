# :localhost:/api/TestVerisiOlustur/:musteriAdet/:sepetAdet
* :musteriAdet -> parametresi random isimlerde ve belirlenen 10 ilden birine random il atanarak müşteri oluşturur
* :sepetAdet -> parametresi random oluşturulan müşterilere bu parametre kadar sepet oluşturur bu oluşturduğu sepetlere random en az 5 ürünler ekler

# :localhost:/api/SehirBazliAnalizYap
* hangi şehirden kaç müşteri var ve kaçar edet sepetleri var bu sepetlerin tutarları toplam ne kadar bu analizin çıktısını json veri şeklinde döndüren router

# :localhost:/api/get/:Name
* bu router Name parametresine tablo adlarını yazarsanız json şeklinde tablonun verileri dönecektir

# :localhost:/api/get/:Name/:Param
bu router istediğiniz tabloyu yazıp id veya yazmazsanız string olarak tablolarda parametrede ki değeri arayacaktır
* örnek 1: musteritablosu:str/ömer -> yazarsanız tabloda ömer olan kayıtları getirecektir
* örnek 2: müsteritablosu:id/1 -> yazarsanız tablodaki id'si 1 olan kaydı getirecektir
