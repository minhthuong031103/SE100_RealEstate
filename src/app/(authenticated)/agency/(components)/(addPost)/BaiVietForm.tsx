/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';
import { SelectAddress } from './SelectAddress';
import { LoaiHinh } from './LoaiHinh';
import { CanHoForm } from './(canho)/CanHoForm';
import { DienTich } from './DienTich';
import { GiayToPhapLy } from './GiayToPhapLy';
import { GiaBan } from './GiaBan';
import { TieuDe } from './TieuDe';
import { MoTaChiTiet } from './MoTaChiTiet';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useBaiViet } from '@/hooks/useBaiViet';
import { VideoUploader } from '@/components/videoUpload/VideoUploader';
import { FileDialog } from '@/components/ui/FileDialog';
import { generateReactHelpers } from '@uploadthing/react/hooks';
import { OurFileRouter } from '@/app/api/uploadthing/core';
import DialogCustom from '@/components/ui/dialogCustom';
import { Spinner } from '@nextui-org/react';
import { ImageList } from '@/components/ui/ImageList';
import { DatePicker } from '@/components/ui/date-picker';
import { Nhan } from './Nhan';

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

export const BaiVietForm = ({ danhMucValue, isChoThue, setOpen }) => {
  const { startUpload } = useUploadThing('imageUploader');

  const [addressValue, setAddressValue] = React.useState('');
  const [loaiHinhValue, setLoaiHinhValue] = React.useState(null);
  const [chieuDai, setChieuDai] = React.useState();
  const [chieuRong, setChieuRong] = React.useState();
  const [phapLy, setPhapLy] = React.useState(null);
  const [giaBan, setGiaBan] = React.useState();
  const [tieuDe, setTieude] = React.useState();
  const [moTa, setMoTa] = React.useState();
  const [phongNgu, setPhongNgu] = React.useState();
  const [phongTam, setPhongTam] = React.useState();
  const [noiThat, setNoiThat] = React.useState();
  const [huongBanCong, setHuongBanCong] = React.useState();
  const [huongCuaChinh, setHuongCuaChinh] = React.useState();
  const [soTang, setSoTang] = React.useState();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isInValid, setIsInValid] = React.useState(false);
  const [productImageFiles, setProductImagesFile] = React.useState([]);
  const [phapLyImageFiles, setPhapLyImageFiles] = React.useState([]);
  const [banVeThietKe, setBanVeThietKe] = React.useState([]);
  const [videoUrl, setVideoUrl] = React.useState();
  const [suaChuaLanCuoi, setSuaChuaLanCuoi] = React.useState();
  const [hoanThanh, setHoanThanh] = React.useState();
  const [danhSachTienNghi, setDanhSachTienNghi] = React.useState([]);

  const { onCreateBaiViet } = useBaiViet();

  const onSubmit = async () => {
    if (productImageFiles.length <= 0) {
      toast.error('Vui lòng chọn hình ảnh sản phẩm');
    }
    if (
      !addressValue ||
      !loaiHinhValue ||
      !chieuDai ||
      !chieuRong ||
      !phapLy ||
      !giaBan ||
      !tieuDe ||
      !moTa
    ) {
      toast.error('Vui lòng nhập đầy đủ thông tin ');
      return;
    }
    if (danhMucValue === 'Căn hộ') {
      if (
        !phongNgu ||
        !phongTam ||
        !noiThat ||
        !huongBanCong ||
        !huongCuaChinh ||
        !soTang
      ) {
        toast.error('Vui lòng nhập đầy đủ thông tin');
        return;
      }
    }
    setIsSubmitting(true);

    // let productImages;
    // let phapLyImages;
    const [productImages, phapLyImages] = await Promise.all([
      startUpload([...productImageFiles]).then((res) => {
        const formattedImages = res?.map((image) => ({
          id: image.key,
          name: image.key.split('_')[1] ?? image.key,
          url: image.url,
        }));
        return formattedImages ?? null;
      }),
      startUpload([...phapLyImageFiles]).then((res) => {
        const formattedImages = res?.map((image) => ({
          id: image.key,
          name: image.key.split('_')[1] ?? image.key,
          url: image.url,
        }));
        return formattedImages ?? null;
      }),
      startUpload([...banVeThietKe]).then((res) => {
        const formattedImages = res?.map((image) => ({
          id: image.key,
          name: image.key.split('_')[1] ?? image.key,
          url: image.url,
        }));
        return formattedImages ?? null;
      }),
    ]);

    console.log(productImages, phapLyImages);
    const baiViet = {
      diaChi: addressValue,
      loaiHinh: loaiHinhValue,
      chieuDai: parseFloat(chieuDai),
      chieuRong: parseFloat(chieuRong),
      dienTich: chieuDai * chieuRong,
      tinhTrangPhapLy: phapLy,
      nhan: 'Test',
      gia: parseFloat(giaBan),
      tieuDe: tieuDe,
      moTa: moTa,
      soPhongNgu: phongNgu ? parseInt(phongNgu) : null,
      soPhongTam: phongTam ? parseInt(phongTam) : null,
      tinhTrangNoiThat: noiThat,
      huongBanCong: huongBanCong,
      hoanThanh: hoanThanh ? new Date(hoanThanh) : null,
      suaChuaLanCuoi: suaChuaLanCuoi ? new Date(suaChuaLanCuoi) : null,
      huongCuaChinh: huongCuaChinh,
      soTang: soTang ? parseInt(soTang) : null,
      hinhAnhSanPham: productImages ? JSON.stringify([...productImages]) : null,
      hinhAnhGiayTo: phapLyImages ? JSON.stringify([...phapLyImages]) : null,
      danhSachTienNghi:
        danhSachTienNghi.length > 0
          ? JSON.stringify([...danhSachTienNghi])
          : null,
      hinhAnhBanVeThietKe: banVeThietKe
        ? JSON.stringify([...banVeThietKe])
        : null,
      isChothue: isChoThue,
      video: videoUrl,
    };

    const success = await onCreateBaiViet(baiViet);
    setIsSubmitting(false);
    if (success) {
      setOpen(false);
    }
  };
  return (
    <div className="w-full h-full flex flex-col space-y-6">
      <SelectAddress
        setAddressValue={setAddressValue}
        addressValue={addressValue}
      />
      <LoaiHinh
        danhMucValue={danhMucValue}
        setLoaiHinhValue={setLoaiHinhValue}
      />
      <DienTich
        chieuDai={chieuDai}
        chieuRong={chieuRong}
        setChieuDai={setChieuDai}
        setChieuRong={setChieuRong}
      />
      <GiayToPhapLy
        phapLyImageFiles={phapLyImageFiles}
        setPhapLyImageFiles={setPhapLyImageFiles}
        setPhapLy={setPhapLy}
      />

      {/* <CanHoForm /> */}
      {
        danhMucValue === 'Căn hộ' && (
          <CanHoForm
            setHuongBanCong={setHuongBanCong}
            setHuongCuaChinh={setHuongCuaChinh}
            setNoiThat={setNoiThat}
            setPhongNgu={setPhongNgu}
            setPhongTam={setPhongTam}
            setSoTang={setSoTang}
            banVeThietKe={banVeThietKe}
            setBanVeThietKe={setBanVeThietKe}
            suaChuaLanCuoi={suaChuaLanCuoi}
            setSuaChuaLanCuoi={setSuaChuaLanCuoi}
            hoanThanh={hoanThanh}
            setHoanThanh={setHoanThanh}
            danhSachTienNghi={danhSachTienNghi}
            setDanhSachTienNghi={setDanhSachTienNghi}
          />
        )
        // <CanHoForm />
      }

      {/* <CanHoForm /> */}

      <GiaBan giaBan={giaBan} setGiaBan={setGiaBan} />
      <div className="flex flex-col gap-y-3 max-w-xs lg:max-w-lg">
        <div className="font-bold text-sm">Hình ảnh bài viết</div>
        <FileDialog
          name="images"
          maxFiles={8}
          maxSize={1024 * 1024 * 4}
          files={productImageFiles}
          setFiles={setProductImagesFile}
          disabled={false}
        />
        {productImageFiles?.length ? (
          <ImageList
            className={'w-full h-36'}
            files={productImageFiles}
            height={32}
            width={32}
          />
        ) : null}
      </div>
      <div className="max-w-xs lg:max-w-2xl flex flex-col gap-y-3w">
        <div className="text-sm font-bold">Video bất động sản</div>
        <VideoUploader videoUrl={videoUrl} setVideoUrl={setVideoUrl} />
      </div>
      <Nhan />
      <TieuDe tieuDe={tieuDe} setTieuDe={setTieude} />
      <MoTaChiTiet moTa={moTa} setMota={setMoTa} />

      {/* <VideoUploader /> */}
      <div className="w-full flex items-center justify-center pt-10">
        <Button
          disabled={isSubmitting}
          onClick={() => {
            onSubmit();
          }}
          className="w-[50%]"
        >
          Đăng bài
        </Button>
      </div>
      {isSubmitting && (
        <DialogCustom
          className="w-[90%] lg:w-[50%] h-fit items-center justify-center"
          isModalOpen={isSubmitting}
          notShowClose={true}
        >
          <div className="flex flex-col gap-3 items-center justify-center">
            <Spinner size="lg" />
            <div className="text-center font-semibold text-xs sm:text-sm">
              Bài viết đang được đăng lên hệ thống, vui lòng chờ trong giây lát
            </div>
          </div>
        </DialogCustom>
      )}
    </div>
  );
};
