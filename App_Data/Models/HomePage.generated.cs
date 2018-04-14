//------------------------------------------------------------------------------
// <auto-generated>
//   This code was generated by a tool.
//
//    Umbraco.ModelsBuilder v3.0.7.99
//
//   Changes to this file will be lost if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Web;
using Umbraco.Core.Models;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Web;
using Umbraco.ModelsBuilder;
using Umbraco.ModelsBuilder.Umbraco;

namespace Umbraco.Web.PublishedContentModels
{
	/// <summary>Главная</summary>
	[PublishedContentModel("HomePage")]
	public partial class HomePage : PublishedContentModel, IBasicInfoComponent, IGlobalDataComponent, ILangComponent, INavigationComponent, ISeoComponent
	{
#pragma warning disable 0109 // new is redundant
		public new const string ModelTypeAlias = "HomePage";
		public new const PublishedItemType ModelItemType = PublishedItemType.Content;
#pragma warning restore 0109

		public HomePage(IPublishedContent content)
			: base(content)
		{ }

#pragma warning disable 0109 // new is redundant
		public new static PublishedContentType GetModelContentType()
		{
			return PublishedContentType.Get(ModelItemType, ModelTypeAlias);
		}
#pragma warning restore 0109

		public static PublishedPropertyType GetModelPropertyType<TValue>(Expression<Func<HomePage, TValue>> selector)
		{
			return PublishedContentModelUtility.GetModelPropertyType(GetModelContentType(), selector);
		}

		///<summary>
		/// Блоки
		///</summary>
		[ImplementPropertyType("blocks")]
		public IEnumerable<IPublishedContent> Blocks
		{
			get { return this.GetPropertyValue<IEnumerable<IPublishedContent>>("blocks"); }
		}

		///<summary>
		/// Слайдер
		///</summary>
		[ImplementPropertyType("slider")]
		public IEnumerable<IPublishedContent> Slider
		{
			get { return this.GetPropertyValue<IEnumerable<IPublishedContent>>("slider"); }
		}

		///<summary>
		/// Имя в навигации: Название ссылки на страницу в навигационных элементах
		///</summary>
		[ImplementPropertyType("navTitle")]
		public string NavTitle
		{
			get { return Umbraco.Web.PublishedContentModels.BasicInfoComponent.GetNavTitle(this); }
		}

		///<summary>
		/// Заголовок страницы: Переопределяет заголовок страницы в браузере (желательно не более 70 символов)
		///</summary>
		[ImplementPropertyType("title")]
		public string Title
		{
			get { return Umbraco.Web.PublishedContentModels.BasicInfoComponent.GetTitle(this); }
		}

		///<summary>
		/// Email для оповещения
		///</summary>
		[ImplementPropertyType("emails")]
		public string Emails
		{
			get { return Umbraco.Web.PublishedContentModels.GlobalDataComponent.GetEmails(this); }
		}

		///<summary>
		/// Email для связи
		///</summary>
		[ImplementPropertyType("globalEmail")]
		public string GlobalEmail
		{
			get { return Umbraco.Web.PublishedContentModels.GlobalDataComponent.GetGlobalEmail(this); }
		}

		///<summary>
		/// Телефон для связи
		///</summary>
		[ImplementPropertyType("globalPhone")]
		public string GlobalPhone
		{
			get { return Umbraco.Web.PublishedContentModels.GlobalDataComponent.GetGlobalPhone(this); }
		}

		///<summary>
		/// Главное меню
		///</summary>
		[ImplementPropertyType("mainMenu")]
		public IEnumerable<IPublishedContent> MainMenu
		{
			get { return Umbraco.Web.PublishedContentModels.GlobalDataComponent.GetMainMenu(this); }
		}

		///<summary>
		/// Соц. сети
		///</summary>
		[ImplementPropertyType("socialNetworks")]
		public IEnumerable<IPublishedContent> SocialNetworks
		{
			get { return Umbraco.Web.PublishedContentModels.GlobalDataComponent.GetSocialNetworks(this); }
		}

		///<summary>
		/// Связанные страницы
		///</summary>
		[ImplementPropertyType("linkedPages")]
		public IEnumerable<IPublishedContent> LinkedPages
		{
			get { return Umbraco.Web.PublishedContentModels.LangComponent.GetLinkedPages(this); }
		}

		///<summary>
		/// Скрыть из навигации
		///</summary>
		[ImplementPropertyType("umbracoNaviHide")]
		public bool UmbracoNaviHide
		{
			get { return Umbraco.Web.PublishedContentModels.NavigationComponent.GetUmbracoNaviHide(this); }
		}

		///<summary>
		/// Перенаправление
		///</summary>
		[ImplementPropertyType("umbracoRedirect")]
		public string UmbracoRedirect
		{
			get { return Umbraco.Web.PublishedContentModels.NavigationComponent.GetUmbracoRedirect(this); }
		}

		///<summary>
		/// Альтернативный Url
		///</summary>
		[ImplementPropertyType("umbracoUrlName")]
		public string UmbracoUrlName
		{
			get { return Umbraco.Web.PublishedContentModels.NavigationComponent.GetUmbracoUrlName(this); }
		}

		///<summary>
		/// Meta - Description
		///</summary>
		[ImplementPropertyType("metaDescription")]
		public string MetaDescription
		{
			get { return Umbraco.Web.PublishedContentModels.SeoComponent.GetMetaDescription(this); }
		}

		///<summary>
		/// Meta - Keywords
		///</summary>
		[ImplementPropertyType("metaKeywords")]
		public string MetaKeywords
		{
			get { return Umbraco.Web.PublishedContentModels.SeoComponent.GetMetaKeywords(this); }
		}

		///<summary>
		/// Изображение для соц. сетей: Изображение которое будет предложено для парсера соц. сетей и месенджеров.
		///</summary>
		[ImplementPropertyType("shareUrlImage")]
		public IPublishedContent ShareUrlImage
		{
			get { return Umbraco.Web.PublishedContentModels.SeoComponent.GetShareUrlImage(this); }
		}
	}
}
